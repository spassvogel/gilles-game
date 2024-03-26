import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Button from 'components/ui/buttons/Button'
import NumberDial from 'components/ui/common/NumberDial'
import ItemsBox from 'components/ui/items/ItemsBox'
import ResourcesCost from 'components/structures/production/ResourcesCost'
import { type ItemType } from 'definitions/items/types'
import * as TextManager from 'global/TextManager'
import { useResourcesState } from 'hooks/store/resources'
import { useWorkersFreeState } from 'hooks/store/useWorkersState'
import { calculateProductionTime, MAX_WORKERS_CRAFTING } from 'mechanics/crafting'
import { formatDuration } from 'utils/format/time'
import { getDefinition as getProductionDefinition } from 'definitions/production'
import { type ProductionDefinition } from 'definitions/production/types'
import { addItemToWarehouse } from 'store/actions/stockpile'
import { removeResources } from 'store/actions/resources'
import { increaseWorkers } from 'store/actions/structures'
import { startTask } from 'store/actions/tasks'
import { TaskType } from 'store/types/task'
import { type Resource } from 'definitions/resources'
import { useStockpileStateFlat } from 'hooks/store/stockpile'
import { type ProducableItem } from 'store/types/structure'
import { type Structure } from 'definitions/structures'

export type Props = {
  item: ProducableItem
  structure: Structure
}

export const CraftingDetails = (props: Props) => {
  const { item, structure } = props
  const dispatch = useDispatch()
  const resourcesState = useResourcesState()
  const stockpileState = useStockpileStateFlat()
  const workersFree = useWorkersFreeState()
  const [workersAssigned, setWorkersAssigned] = useState<number>(0)

  const produces = getProductionDefinition(item)
  const costResources = produces.cost.resources ?? {}
  const missingAtLeastOneResource = Object.keys(costResources)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .some((key) => {
      const resource: Resource = key as Resource
      return costResources[resource]! > resourcesState[resource]!
    })

  let missingAtLeastOneItem = false
  const costMaterials = produces.cost.materials
  if (costMaterials != null) {
    missingAtLeastOneItem = costMaterials.some((i: ItemType) => !stockpileState.includes(i))
  }

  const disabled = missingAtLeastOneResource || missingAtLeastOneItem || workersAssigned < 1
  // TODO: [10/07/2019] Perhaps each item can have a number of minimum workers?
  const makeTimeString = (asNumber: number): string => {
    if (workersAssigned === 0) {
      return ''
    }
    const craftingTime = calculateProductionTime(asNumber, workersAssigned)
    const time = formatDuration(craftingTime)
    return TextManager.get('ui-structure-production-crafting-time', { time })
  }

  const handleCraft = (productionDefinition: ProductionDefinition, workers: number) => {
    const craftingTime = calculateProductionTime(productionDefinition.cost.time ?? 0, workers)
    dispatch(removeResources((productionDefinition.cost.resources != null) || {}))
    dispatch(increaseWorkers(structure, workers))

    const callbacks = [
      addItemToWarehouse(productionDefinition.item),
      increaseWorkers(structure, workers)
    ]
    const start = startTask(
      TaskType.craftItem,
      productionDefinition.item.type,
      `${structure}.craft`,
      craftingTime,
      callbacks)
    dispatch(start)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    handleCraft(produces, workersAssigned)
    setWorkersAssigned(0)
  }

  const handleUp = (e: React.MouseEvent) => {
    e.stopPropagation()
    setWorkersAssigned(workersAssigned + 1)
  }

  const handleDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setWorkersAssigned(workersAssigned - 1)
  }

  return (
    <div className="crafting-details">
      <div className="crafting-item">
        {TextManager.get('ui-structure-production-craft-a', { item })}
      </div>
      <div className="crafting-costs">
        <fieldset>
          <ResourcesCost resources={costResources} />
        </fieldset>
        <fieldset>
          {(costMaterials != null) && <ItemsBox items={costMaterials} />}
        </fieldset>
      </div>
      <div className="buttonrow">
        <div>
          <NumberDial
            value={workersAssigned}
            label={TextManager.get('ui-structure-production-workers')}
            onUp={handleUp}
            onDown={handleDown}
            upDisabled={workersAssigned >= workersFree ||
              workersAssigned >= MAX_WORKERS_CRAFTING}
            downDisabled={workersAssigned < 1} />
          {makeTimeString(produces.cost.time ?? 0)}
        </div>
        <div>
          <Button
            disabled={disabled}
            className="craft"
            onClick={handleClick}
          >
            {TextManager.get('ui-structure-production-craft')}
          </Button>
        </div>
      </div>
    </div>
  )
}

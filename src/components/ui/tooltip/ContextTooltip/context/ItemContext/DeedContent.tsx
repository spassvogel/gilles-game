import { useDispatch } from 'react-redux'
import { type Structure } from 'definitions/structures'
import { subtractGold } from 'store/actions/gold'
import { startBuildingStructure, finishBuildingStructure } from 'store/actions/structures'
import { startTask } from 'store/actions/tasks'
import { TaskType } from 'store/types/task'
import { type Deed, getDefinition as getDeedDefinition } from 'definitions/items/deeds'
import useGoldState from 'hooks/store/useGoldState'
import { useStructureDefinition, useStructureState } from 'hooks/store/structures'
import { StructureState } from 'store/types/structure'
import * as TextManager from 'global/TextManager'
import Button from 'components/ui/buttons/Button'
import { ItemCategory, type Item } from 'definitions/items/types'
import ResourcesCost from 'components/structures/production/ResourcesCost'
import { useEnoughResources } from 'hooks/store/resources'
import { useStockpileState } from 'hooks/store/stockpile'
import { removeItemFromWarehouse } from 'store/actions/stockpile'

type Props = {
  item: Item<Deed>
}

const DeedContent = (props: Props) => {
  const { item } = props
  const definition = getDeedDefinition(item.type)
  const dispatch = useDispatch()

  const gold = useGoldState()
  const structureDefinition = useStructureDefinition(definition.structure)
  const enoughGold = (structureDefinition.cost.gold ?? 0) >= gold
  const structureStoreState = useStructureState(definition.structure)
  const notBuiltYet = structureStoreState.state === StructureState.NotBuilt
  const { time, resources = {} } = structureDefinition.cost
  const sufficientResources = useEnoughResources(resources)
  const disabled = !notBuiltYet || !enoughGold || !sufficientResources
  const subtext = TextManager.get('item-deed-subtext', { structure: definition.structure })

  const stockpile = useStockpileState()
  const stockpileIndex = stockpile.deed.findIndex((d) => d === item)

  const handleStartConstruction = (structure: Structure) => {
    dispatch(subtractGold(structureDefinition.cost.gold ?? 0))
    dispatch(startBuildingStructure(structure))
    dispatch(removeItemFromWarehouse(ItemCategory.deed, stockpileIndex))

    // todo: show toast
    const callbacks = [finishBuildingStructure(structure)]
    const start = startTask(TaskType.buildStructure,
      `${structure}.build`,
      'town',
      time ?? 0,
      callbacks)
    dispatch(start)
  }
  return (
    <div>
      <p className="subtext">{`"${subtext}"`}</p>
      <hr/>
      <ResourcesCost
        resources={resources}
        gold={gold}
      />
      <Button
        disabled={disabled}
        size="small"
        onClick={() => { handleStartConstruction(definition.structure) }}
      >
       {TextManager.get('ui-structure-start-construction')}
      </Button>
    </div>
  )
}

export default DeedContent

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
import { TextManager } from 'global/TextManager'
import Button from 'components/ui/buttons/Button'
import { type Item } from 'definitions/items/types'

type Props = {
  item: Item<Deed>
}

const DeedContent = (props: Props) => {
  const { item } = props
  const definition = getDeedDefinition(item.type)
  const dispatch = useDispatch()

  const gold = useGoldState()
  const structureDefinition = useStructureDefinition(definition.structure)
  const enoughGold = structureDefinition.cost.gold ?? gold >= 0
  const structureStoreState = useStructureState(definition.structure)
  const canBeBuilt = structureStoreState.state === StructureState.NotBuilt
  const disabled = !canBeBuilt || !enoughGold
  const subtext = TextManager.getItemSubtext(item.type)

  const handleStartConstruction = (structure: Structure) => {
    dispatch(subtractGold(structureDefinition.cost.gold ?? 0))
    dispatch(startBuildingStructure(structure))

    const callbacks = [finishBuildingStructure(structure)]
    const time = structureDefinition.cost.time
    const start = startTask(TaskType.buildStructure,
      `${structure}.build`,
      'town',
      time ?? 0,
      callbacks)
    dispatch(start)
  }
  return (
    <div>
      { subtext && (<p className="subtext">{`"${subtext}"`}</p>)}
      <Button
        disabled={disabled}
        size="small"
        onClick={() => { handleStartConstruction(definition.structure) }}
      >
        Start construction ({ structureDefinition.cost.gold } gold)
      </Button>
    </div>
  )
}

export default DeedContent

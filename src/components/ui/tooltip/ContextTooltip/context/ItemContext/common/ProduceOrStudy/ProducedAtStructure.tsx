import { Link } from 'react-router-dom'
import { type ItemType } from 'definitions/items/types'
import { getDefinition as getProductionDefinition } from 'definitions/production'
import { useStructureState } from 'hooks/store/structures'
import { type Structure } from 'definitions/structures'
import { type ProducableItem, type ProductionStructureStoreState, StructureState } from 'store/types/structure'
import { getStructureLink } from 'utils/routing'
import * as TextManager from 'global/TextManager'
import { useStudyingTasksStateByStructure } from 'hooks/store/useTasksState'
import { startTask } from 'store/actions/tasks'
import { TaskType } from 'store/types/task'
import { useDispatch } from 'react-redux'
import { addItemToToProduces } from 'store/actions/structures'
import { formatDuration } from 'utils/format/time'
import { STUDY_TIME } from 'mechanics/studying'
import Button from 'components/ui/buttons/Button'
import ReactMarkdown from 'react-markdown'
import Markdown from 'components/markdown/Markdown'

type Props = {
  item: ProducableItem
  structure: Structure
}

// refactor 2021-02-19 becomes 'CraftedAtStructure'
const ProducedAtStructure = (props: Props) => {
  const { structure } = props
  const structureStore: ProductionStructureStoreState = useStructureState(structure)
  const studyTasks = useStudyingTasksStateByStructure(structure)
  const dispatch = useDispatch()

  if (structure == null) {
    return null
  }

  // const structureDefinition = getStructureDefinition<ProductionStructureDefinition>(structure)
  // Can already be produced
  if (structureStore.produces.some((item: ItemType) => item === props.item)) {
    return (
      <Markdown>
        {TextManager.get('ui-tooltip-crafted-at', { structure })}
      </Markdown>
    )
  }

  // Currently studied
  const task = studyTasks.find(sT => sT.name === props.item)
  if (task != null) {
    return (
      <p>
        <Link to={getStructureLink(structure)} >
          {TextManager.get('ui-tooltip-study-currently-studying')}
        </Link>
        {formatDuration(task.timeRemaining, true)}
      </p>
    )
  }

  // Cant study because the structure is not high lvl enough
  const productionDefinition = getProductionDefinition(props.item)
  if (structureStore.level < (productionDefinition.levelRequired ?? 0) || structureStore.state !== StructureState.Built) {
    return (
      <p className="invalid">
        {TextManager.get('ui-tooltip-study-requires-structure-level', { structure, level: (productionDefinition.levelRequired ?? 0) + 1 })}
      </p>
    )
  }

  const startStudy = () => {
    const callbacks = [
      addItemToToProduces(props.structure, props.item)
    ]

    const studyTime = STUDY_TIME
    const start = startTask(TaskType.studyItem,
      props.item,
      `${structure}.study`,
      studyTime,
      callbacks)
    dispatch(start)
  }

  return (
    <p>
      <Button onClick={startStudy} size="small">
        {TextManager.get('ui-tooltip-study-start-study')}
      </Button>
      <ReactMarkdown>{TextManager.get('ui-tooltip-study-start', { structure })}</ReactMarkdown>
    </p>
  )
}

export default ProducedAtStructure

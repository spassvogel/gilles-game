import { type ResourceStructure, type Structure } from 'definitions/structures'
import { type ResourceStructureLevelDefinition } from 'definitions/structures/types'
import UpDownValue from 'components/ui/common/NumberDial'
import { useSelector, useDispatch } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { type StoreState } from 'store/types'
import { selectFreeWorkers } from 'store/selectors/workers'
import { decreaseWorkers, increaseWorkers, removeItemFromHarvest } from 'store/actions/structures'
import StructureViewHeader from '../StructureViewHeader'
import { TextManager } from 'global/TextManager'
import StructureLevel from '../StructureLevel'
import { TooltipManager } from 'global/TooltipManager'
import { useStructureLevel, useStructureState } from 'hooks/store/structures'
import ResourceGenerationRow from './ResourceGenerationRow'
import { type Resource } from 'definitions/resources'
import DraggableItemsList from 'components/ui/items/DraggableItemsList'
import { type Item } from 'definitions/items/types'
import { DragSourceType } from 'constants/dragging'
import HarvestProgress from './HarvestProgress'
import IconButton from 'components/ui/buttons/IconButton'
import warehouseIcon from 'components/structures/styles/images/warehouse/icon.png'
import { addItemToWarehouse } from 'store/actions/stockpile'
import UpgradeHelpModal from '../UpgradeHelpModal'
import UpgradeHelpModalContent from './UpgradeHelpModalContent'
import { ContextType } from 'constants/context'
import './styles/resourceStructureView.scss'

export type Props = {
  structure: Structure
}

const selectHarvest = (store: StoreState, structure: ResourceStructure): Item[] => {
  return store.structures[structure].harvest ?? []
}

// todo: 02/12/2019 [ ] Can show progress bar in resource screen
const ResourceStructureView = (props: Props) => {
  const { structure } = props

  // Fetch needed values from store
  const { level, workers } = useStructureState(structure)
  const workersFree = 18 // useSelector<StoreState, number>((store) => selectFreeWorkers(store))
  const harvest = useSelector<StoreState, Item[]>((store) => selectHarvest(store, structure as ResourceStructure))
  const levelDefinition = useStructureLevel<ResourceStructureLevelDefinition>(structure)

  // Reducer dispatch
  const dispatch = useDispatch()
  const handleWorkersDown = () => {
    dispatch(decreaseWorkers(props.structure))
  }

  const handleWorkersUp = () => {
    dispatch(increaseWorkers(props.structure))
  }

  const upDisabled = workers === levelDefinition.workerCapacity || (workersFree ?? 0) < 1
  const downDisabled = workers === 0

  const handleHelpClicked = (event: React.MouseEvent) => {
    const origin = (event.currentTarget as HTMLElement)
    const originRect = origin.getBoundingClientRect()
    const content = (
      <UpgradeHelpModal level={level} structure={structure}>
        <UpgradeHelpModalContent level={level} structure={structure}/>
      </UpgradeHelpModal>
    )
    TooltipManager.showContextTooltip(ContextType.component, content, originRect, 'upgrade-structure-tooltip')

    event.stopPropagation()
  }

  const handleItemTake = (item: Item, index: number) => {
    dispatch(removeItemFromHarvest(structure, index))
    dispatch(addItemToWarehouse(item))
  }

  return (
    <>
      <StructureViewHeader structure={props.structure} />
      <div className="resource-structure-view">
        <section>
          <StructureLevel structure={structure} onHelpClicked={handleHelpClicked}/>
          <UpDownValue
            label={TextManager.get('ui-structure-production-workers')}
            value={workers}
            max={levelDefinition.workerCapacity}
            upDisabled={upDisabled}
            downDisabled={downDisabled}
            onDown={handleWorkersDown}
            onUp={handleWorkersUp}
          />
          { /** Generates this resource */}
          <h3>Generates</h3>
          { Object.keys(levelDefinition.generates).map(r => <ResourceGenerationRow structure={structure} resource={r as Resource} key={r} />)}

          { (levelDefinition.harvest != null) && (
            <>
              <h3>Harvest</h3>
              <ReactMarkdown>
                {TextManager.get(`ui-structure-resource-harvest-${structure}`)}
              </ReactMarkdown>
              <HarvestProgress structure={structure} />
              <DraggableItemsList
                items={harvest}
                sourceType={DragSourceType.resourceStructure}
                sourceId={structure}
                slots={levelDefinition.harvest?.amount}
                renderButton={(item: Item, index: number) => (<IconButton iconImg={warehouseIcon} onClick={() => { handleItemTake(item, index) }} >Take</IconButton>)}
              />

            </>
          )}

        </section>
      </div>
    </>
  )
}

export default ResourceStructureView

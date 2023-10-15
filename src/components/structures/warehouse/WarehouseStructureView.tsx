import ResourcesBox from 'components/structures/warehouse/ResourcesBox'
import { type WarehouseStructureLevelDefinition } from 'definitions/structures/types'
import usePrevious from 'hooks/usePrevious'
import { useEffect, useRef, useState } from 'react'
import { empty, type ResourceStoreState } from 'store/types/resources'
import { type StructuresStoreState } from 'store/types/structures'
import { TextManager } from 'global/TextManager'
import { TooltipManager } from 'global/TooltipManager'
import AdventurerTabstrip from 'components/ui/adventurer/AdventurerTabstrip/AdventurerTabstrip'
import { useStructureLevel, useStructureState } from 'hooks/store/structures'
import { useResourcesState } from 'hooks/store/resources'
import { useSelector } from 'react-redux'
import { type StoreState } from 'store/types'
import { useAdventurersInTown } from 'hooks/store/adventurers'
import StructureLevel from '../StructureLevel'
import AdventurerPanel from 'components/ui/adventurer/AdventurerPanel'
import { type Resource } from 'definitions/resources'
import UpgradeHelpModal from '../UpgradeHelpModal'
import UpgradeHelpModalContent from './UpgradeHelpModalContent'
import Stockpile from './Stockpile'
import { Channel, SoundManager } from 'global/SoundManager'
import './styles/warehouseStructureView.scss'
import { ContextType } from 'constants/context'

const WarehouseStructureView = () => {
  const adventurersInTown = useAdventurersInTown()
  const [selectedAdventurer, setSelectedAdventurer] = useState<string>(adventurersInTown[0]?.id)
  const resources = useResourcesState()
  const [resourcesDelta, setResourcesDelta] = useState<ResourceStoreState>(empty) // updating this will trigger animation
  const previousResources = usePrevious(resources)
  const resourcesRef = useRef<HTMLFieldSetElement>(null)
  const structuresState = useSelector<StoreState, StructuresStoreState>(store => store.structures)

  useEffect(() => {
    void SoundManager.playSound('AMBIENT_STRUCTURE_WAREHOUSE', Channel.ambient, true)
    return () => { SoundManager.fadeOutSound(Channel.ambient) }
  }, [])

  useEffect(() => {
    // Calculate delta
    const delta = Object.keys(resources).reduce<ResourceStoreState>((acc, value) => {
      const resource = value as Resource
      if ((previousResources?.[resource]) != null) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        acc[resource] = resources[resource]! - previousResources[resource]!
      }
      return acc
    }, {})

    setResourcesDelta(delta)
  }, [resources, previousResources])

  const structureState = useStructureState('warehouse')
  const { level } = structureState
  const levelDefinition = useStructureLevel<WarehouseStructureLevelDefinition>('warehouse')

  const handleAdventurerTabSelected = (tabId: string) => {
    setSelectedAdventurer(tabId)
  }

  const handleHelpClicked = (event: React.MouseEvent) => {
    const origin = (event.currentTarget as HTMLElement)
    const originRect = origin.getBoundingClientRect()
    const content = (
      <UpgradeHelpModal level={level} structure={'warehouse'}>
        <UpgradeHelpModalContent level={level} />
      </UpgradeHelpModal>
    )
    TooltipManager.showContextTooltip(ContextType.component, content, originRect, 'upgrade-structure-tooltip')

    event.stopPropagation()
  }

  return (
    <div className="warehouse-structureview">
      <StructureLevel structure={'warehouse'} onHelpClicked={handleHelpClicked} />
      <fieldset className="resources" ref={resourcesRef}>
        <legend>{TextManager.get('ui-structure-warehouse-resources')}</legend>
        <ResourcesBox
          resources={resources}
          structures={structuresState}
          maxResources={levelDefinition.maxResources}
          deltaResources={resourcesDelta}
        />
      </fieldset>
      <h3>{TextManager.get('ui-structure-warehouse-stockpile')}</h3>
      <Stockpile />
      <h3>{TextManager.get('ui-structure-warehouse-adventurers')}</h3>
      <div>
        <AdventurerTabstrip
          adventurers={adventurersInTown}
          selectedAdventurerId={selectedAdventurer}
          onAdventurerTabSelected={handleAdventurerTabSelected}
        />
        <div className="adventurer-inventory">
          { (selectedAdventurer.length > 0) && (
            <AdventurerPanel
              adventurerId={selectedAdventurer}
              horizontalMode={true}
              traits={false}
              skills={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default WarehouseStructureView

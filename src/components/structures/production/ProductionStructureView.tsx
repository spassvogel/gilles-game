import { useEffect } from 'react'
import { type ItemType } from 'definitions/items/types'
import { type Structure } from 'definitions/structures'
import { type ProductionStructureDefinition } from 'definitions/structures/types'
import { TextManager } from 'global/TextManager'
import { formatDuration } from 'utils/format/time'
import { TickingProgressbar } from 'components/ui/common/progress'
import { useStructureDefinition, useStructureState } from 'hooks/store/structures'
import { useCraftingTasksStateByStructure, useStudyingTasksStateByStructure } from 'hooks/store/useTasksState'
import StructureViewHeader from '../StructureViewHeader'
import StructureLevel from '../StructureLevel'
import { TooltipManager } from 'global/TooltipManager'
import CraftingArea from './CraftingArea'
import { addItemToToProduces } from 'store/actions/structures'
import UpgradeHelpModal from '../UpgradeHelpModal'
import UpgradeHelpModalContent from './UpgradeHelpModalContent'
import { SoundManager, Channel } from 'global/SoundManager'

import './styles/productionStructureView.scss'
import { ContextType } from 'constants/context'

export type Props = {
  structure: Structure
}

const ProductionStructureView = (props: Props) => {
  const { structure } = props
  const level = useStructureState(structure).level

  const craftingTasks = useCraftingTasksStateByStructure(structure)
  const studyingTasks = useStudyingTasksStateByStructure(structure)
  const structureDefinition = useStructureDefinition<ProductionStructureDefinition>(props.structure)

  useEffect(() => {
    if (structure === 'armoursmith' || structure === 'weaponsmith') {
      void SoundManager.playSound('AMBIENT_STRUCTURE_SMITH', Channel.ambient, true)
    }
    if (structure === 'alchemist') {
      void SoundManager.playSound('AMBIENT_STRUCTURE_ALCHEMIST', Channel.ambient, true)
    }
    return () => { SoundManager.fadeOutSound(Channel.ambient) }
  }, [structure])

  const handleUpgradeCallbacks = (nextLevel: number) => {
    const nextLevelDefinition = structureDefinition.levels[nextLevel]
    return nextLevelDefinition.unlocks.map(item => addItemToToProduces(structure, item))
  }

  const handleHelpClicked = (event: React.MouseEvent) => {
    const origin = (event.currentTarget as HTMLElement)
    const originRect = origin.getBoundingClientRect()
    const content = (
      <UpgradeHelpModal
        level={level}
        structure={structure}
        addUpgradeCallbacks={handleUpgradeCallbacks}
      >
        <UpgradeHelpModalContent level={level} structure={structure}/>
      </UpgradeHelpModal>
    )
    TooltipManager.showContextTooltip(ContextType.component, content, originRect, 'upgrade-structure-tooltip')

    event.stopPropagation()
  }

  return (
    // TODO: abstract some stuff to generic StructureView
    <>
      <StructureViewHeader structure={props.structure} />
      <div className="production-structure-view">
        <section>
          <StructureLevel
            structure={structure}
            onHelpClicked={handleHelpClicked}
          />
          <CraftingArea structure={structure} />
          <fieldset className="crafting-log">
            <legend>{TextManager.get('ui-structure-production-crafting')}</legend>
            {craftingTasks.map((t) => (
              <TickingProgressbar
                key={`${t.name}${t.startTime}`}
                label={`${TextManager.getItemName(t.name as ItemType)} (${formatDuration(t.timeRemaining)})`}
                progress={t.progress}
              />
            ))}
          </fieldset>
          {studyingTasks.length > 0 && (
          <fieldset>
            <legend>{TextManager.get('ui-structure-production-studying')}</legend>
            {studyingTasks.map((t) => (
              <TickingProgressbar
                key={`${t.name}${t.startTime}`}
                label={`${TextManager.getItemName(t.name as ItemType)} (${formatDuration(t.timeRemaining)})`}
                progress={t.progress}
              />
            ))}
          </fieldset>
          )}
        </section>
      </div>
    </>
  )
}

export default ProductionStructureView

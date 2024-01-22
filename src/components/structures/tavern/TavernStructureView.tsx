import { type TavernStructureDefinition, type TavernStructureLevelDefinition } from 'definitions/structures/types'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { QuestStatus, type QuestStoreState } from 'store/types/quest'
import * as TextManager from 'global/TextManager'
import { ToastManager } from 'global/ToastManager'
import { TooltipManager } from 'global/TooltipManager'
import { Type } from 'components/ui/toasts/Toast'
import { getQuestLink } from 'utils/routing'
import RoomList from './rooms/RoomList'
import { useEffect, useState } from 'react'
import QuestBoard from './QuestBoard'
import { useStructureDefinition, useStructureState } from 'hooks/store/structures'
import { useSelector, useDispatch } from 'react-redux'
import { type StoreState } from 'store/types'
import { launchQuest } from 'store/actions/quests'
import { type AdventurerAvatarDragInfo } from 'components/ui/adventurer/DraggableAdventurerAvatar'
import StructureLevel from '../StructureLevel'
import StructureViewHeader from '../StructureViewHeader'
import UpgradeHelpModal from '../UpgradeHelpModal'
import UpgradeHelpModalContent from './UpgradeHelpModalContent'
import { Channel, SoundManager } from 'global/SoundManager'
import './styles/tavernStructureView.scss'
import { ContextType } from 'constants/context'

export const SOURCE_ID = 'tavern'

// The UI for the tavern
const TavernStructureView = () => {
  const level = useStructureState('tavern').level
  const adventurers = useSelector<StoreState, AdventurerStoreState[]>(store => store.adventurers)
  const quests = useSelector<StoreState, QuestStoreState[]>(store => store.quests)

  const [assignedAventurers, setAassignedAdventurers] = useState<AdventurerStoreState[]>([])
  const [selectedQuest, setSelectedQuest] = useState<string>()

  const structureDefinition = useStructureDefinition<TavernStructureDefinition>('tavern')
  const levelDefinition: TavernStructureLevelDefinition = structureDefinition.levels[level]

  const dispatch = useDispatch()

  useEffect(() => {
    void SoundManager.playSound('AMBIENT_STRUCTURE_TAVERN', Channel.ambient, true)
    return () => { SoundManager.fadeOutSound(Channel.ambient) }
  }, [])

  const onLaunchQuest = (questName: string) => {
    dispatch(launchQuest(questName, assignedAventurers))
  }

  const getAvailableQuests = quests.filter((q) => q.status === QuestStatus.available)

  const handleQuestClick = (name: string): void => {
    if (selectedQuest === name) {
      setSelectedQuest(undefined)
    } else {
      setSelectedQuest(name)
    }

    // Unassign all adventurers
    setAassignedAdventurers([])
  }

  const handleAddAdventurer = (adventurer: AdventurerStoreState, index: number): void => {
    const copy = [...assignedAventurers]
    copy[index] = adventurer
    setAassignedAdventurers(copy)
  }

  const handleAdventurerDropped = (item: AdventurerAvatarDragInfo, index: number) => {
    if (item.sourceId === SOURCE_ID) {
      handleAddAdventurer(item.adventurer, index)
    }
  }

  const handleRemoveAdventurer = (adventurer: AdventurerStoreState): void => {
    setAassignedAdventurers(assignedAventurers.filter(a => (a !== adventurer)))
  }

  const handleLaunchQuest = (): void => {
    if (selectedQuest === undefined) return

    const questTitle = TextManager.getQuestTitle(selectedQuest)
    const leader = assignedAventurers[0]
    ToastManager.addToast(questTitle, Type.questLaunched, leader?.avatarImg, getQuestLink(selectedQuest))
    onLaunchQuest(selectedQuest)
  }

  const handleHelpClicked = (event: React.MouseEvent) => {
    const origin = (event.currentTarget as HTMLElement)
    const originRect = origin.getBoundingClientRect()
    const content = (
      <UpgradeHelpModal level={level} structure={'tavern'}>
        <UpgradeHelpModalContent level={level} />
      </UpgradeHelpModal>
    )
    TooltipManager.showContextTooltip(ContextType.component, content, originRect, 'upgrade-structure-tooltip')

    event.stopPropagation()
  }

  return (
    <>
      <StructureViewHeader structure={'tavern'} />
      <div className="tavern-structure-view">
        <StructureLevel structure={'tavern'} onHelpClicked={handleHelpClicked}/>
        <section>
          <RoomList
            roomCount={levelDefinition.rooms}
            adventurers={adventurers}
            assignedAventurers={assignedAventurers}
            quests={quests}
            selectedQuestName={selectedQuest}
            onAddAdventurer={handleAddAdventurer}
            onRemoveAdventurer={handleRemoveAdventurer}
          />
          <QuestBoard
            availableQuests={getAvailableQuests}
            selectedQuestName={selectedQuest}
            assignedAventurers={assignedAventurers}
            onQuestClick={(name: string) => { handleQuestClick(name) }}
            onAdventurerDropped={handleAdventurerDropped}
            onRemoveAdventurer={handleRemoveAdventurer}
            onLaunchQuest={handleLaunchQuest}
          />
        </section>
      </div>
    </>
  )
}

export default TavernStructureView

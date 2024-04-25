import { type AdventurerStoreState } from 'store/types/adventurer'
import { type QuestStoreState } from 'store/types/quest'
import * as TextManager from 'global/TextManager'
import { type AdventurerAvatarDragInfo } from 'components/ui/adventurer/DraggableAdventurerAvatar'
import QuestDetails from './QuestDetails'

import './styles/questboard.scss'

export const AVAILABLE_SLOTS = 5

export type Props = {
  availableQuests: QuestStoreState[]
  selectedQuestName?: string // name of selected quest
  assignedAventurers: AdventurerStoreState[]

  onQuestClick: (questName: string) => void
  onAdventurerDropped: (item: AdventurerAvatarDragInfo, index: number) => void
  onRemoveAdventurer: (adventurer: AdventurerStoreState) => void
  onLaunchQuest: () => void
}

const QuestBoard = (props: Props) => {
  // quest board, expanded quest info + assign adventurers + launch button
  const {
    availableQuests,
    selectedQuestName,
    assignedAventurers,
    onQuestClick,
    onLaunchQuest,
    onAdventurerDropped,
    onRemoveAdventurer
  } = props
  return (
    <div className="quest-board">
      <h2>
        {TextManager.get('ui-structure-tavern-title-quest-board')}
      </h2>
      <ul className="quest-list">
        {availableQuests.map((q) => {
          const className = `quest ${(q.name === selectedQuestName) ? ' selected' : ''}`
          return (
            <li key={q.name}
              className={className}
              onClick={() => { onQuestClick(q.name) } }
            >
              <div
                className="icon"
                style={{ backgroundImage: 'url()' }}
              />
              <div className="title">{TextManager.getQuestTitle(q.name) } </div>
            </li>
          )
        })}
      </ul>
      { selectedQuestName != null && (
        <QuestDetails
          selectedQuestName={selectedQuestName}
          assignedAventurers={assignedAventurers}
          onAdventurerDropped={onAdventurerDropped}
          onRemoveAdventurer={onRemoveAdventurer}
          onLaunchQuest={onLaunchQuest}
        />
      )}
    </div>
  )
}

export default QuestBoard

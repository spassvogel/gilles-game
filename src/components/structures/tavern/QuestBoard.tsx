import { type ItemType } from 'definitions/items/types'
import { getDefinition } from 'definitions/quests'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { type QuestStoreState } from 'store/types/quest'
import { TextManager } from 'global/TextManager'
import AssignAdventurers from './AssignAdventurers'
import { type QuestDefinition } from 'definitions/quests/types'
import Button from 'components/ui/buttons/Button'
import ItemsBox from 'components/ui/items/ItemsBox'
import { type AdventurerAvatarDragInfo } from 'components/ui/adventurer/DraggableAdventurerAvatar'
import { useStockpileStateFlat } from 'hooks/store/stockpile'
import './styles/questboard.scss'

export const AVAILABLE_SLOTS = 5
const minimumCountAdventurers = 3 // we need this many adventurers to start the quest

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
  const items = useStockpileStateFlat()

  /**
   * Returns true if all the items required by the quest are in the inventory
   */
  const checkEnoughItems = (questDefinition: QuestDefinition): boolean => {
    if (questDefinition.requiredItems == null) {
      return true
    }
    return questDefinition.requiredItems.every((item: ItemType) => {
      const amountRequired = (questDefinition.requiredItems)?.filter((i) => i === item).length
      return items.filter((i) => i === item).length >= (amountRequired ?? 0)
    })
  }

  const getQuestDetails = () => {
    if (!props.selectedQuestName) {
      return null
    }
    const quest = props.availableQuests.find((q) => q.name === props.selectedQuestName)
    if (quest == null) {
      return (
        <div> { TextManager.get('ui-structure-tavern-quest-launched') } </div>
      )
    }
    const questDefinition = getDefinition(quest.name)

    // Need a full party to launch
    const fullParty = props.assignedAventurers.filter((a) => a !== null).length >= minimumCountAdventurers
    // Check if we have the required items
    const enoughItems = checkEnoughItems(questDefinition)

    const canLaunch = fullParty && enoughItems

    return (
      <div className="quest-details">
        {TextManager.getQuestDescription(props.selectedQuestName)}
        <AssignAdventurers
          availableSlots={AVAILABLE_SLOTS}
          assignedAventurers={props.assignedAventurers}
          onAdventurerClicked={props.onRemoveAdventurer}
          onAdventurerDropped={props.onAdventurerDropped}
        />
        <ItemsBox items={ (questDefinition.requiredItems != null) || [] }/>
        <Button disabled={!canLaunch} onClick = { () => { props.onLaunchQuest() } }>
          {TextManager.get('ui-structure-tavern-button-launch-quest')}
        </Button>
      </div>
    )
  }

  // quest board, expanded quest info + assign adventurers + launch button
  return (
    <div className="quest-board">
      <h2>
        {TextManager.get('ui-structure-tavern-title-quest-board')}
      </h2>
      <ul className="quest-list">
        {props.availableQuests.map((q) => {
          const className = `quest ${(q.name === props.selectedQuestName) ? ' selected' : ''}`
          return (
            <li key={q.name}
              className={className}
              onClick={() => { props.onQuestClick(q.name) } }
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
      { getQuestDetails() }
    </div>
  )
}

export default QuestBoard

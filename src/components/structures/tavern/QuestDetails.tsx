import { useQuest } from 'hooks/store/quests'
import * as TextManager from 'global/TextManager'
import { getDefinition } from 'definitions/quests'
import { type AdventurerStoreState } from 'store/types/adventurer'
import AssignAdventurers from './AssignAdventurers'
import Button from 'components/ui/buttons/Button'
import ItemsBox from 'components/ui/items/ItemsBox'
import { useEnoughMaterials } from 'hooks/store/stockpile'
import { AVAILABLE_SLOTS } from './QuestBoard'
import { type AdventurerAvatarDragInfo } from 'components/ui/adventurer/DraggableAdventurerAvatar'

const minimumCountAdventurers = 3 // we need this many adventurers to start the quest

type Props = {
  selectedQuestName: string
  assignedAventurers: AdventurerStoreState[]

  onAdventurerDropped: (item: AdventurerAvatarDragInfo, index: number) => void
  onRemoveAdventurer: (adventurer: AdventurerStoreState) => void
  onLaunchQuest: () => void
}

const QuestDetails = (props: Props) => {
  const { selectedQuestName, assignedAventurers, onAdventurerDropped, onRemoveAdventurer, onLaunchQuest } = props
  const quest = useQuest(selectedQuestName)
  // if (quest == null) {
  //   return (
  //     <div> { TextManager.get('ui-structure-tavern-quest-launched') } </div>
  //   )
  // }
  const questDefinition = getDefinition(quest.name)

  // Need a full party to launch
  const fullParty = assignedAventurers.filter((a) => a !== null).length >= minimumCountAdventurers
  // Check if we have the required items
  const enoughItems = useEnoughMaterials(questDefinition.requiredItems ?? [])

  const canLaunch = fullParty && enoughItems

  return (
    <div className="quest-details">
      {TextManager.getQuestDescription(quest.name)}
      <AssignAdventurers
        availableSlots={AVAILABLE_SLOTS}
        assignedAventurers={assignedAventurers}
        onAdventurerClicked={onRemoveAdventurer}
        onAdventurerDropped={onAdventurerDropped}
      />
      <ItemsBox items={questDefinition.requiredItems ?? []}/>
      <Button disabled={!canLaunch} onClick = { () => { onLaunchQuest() } }>
        {TextManager.get('ui-structure-tavern-button-launch-quest')}
      </Button>
    </div>
  )
}

export default QuestDetails

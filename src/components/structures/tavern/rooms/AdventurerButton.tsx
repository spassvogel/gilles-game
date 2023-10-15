import { type AdventurerStoreState } from 'store/types/adventurer'
import { AVAILABLE_SLOTS } from '../QuestBoard'
import Button from 'components/ui/buttons/Button'
import { TextManager } from 'global/TextManager'
import './styles/adventurerButton.scss'

export type Props = {
  adventurer: AdventurerStoreState
  assignedAventurers: AdventurerStoreState[] // assigned to a quest in the QuestBoard
  questName: string

  onAddAdventurer: (adventurer: AdventurerStoreState, index: number) => void
  onRemoveAdventurer: (adventurer: AdventurerStoreState) => void
}

// Finds the first array index with a falsey value
const getEmptySlot = (assignedAventurers: AdventurerStoreState[]) => {
  for (let i = 0; i < AVAILABLE_SLOTS; i++) {
    if (!assignedAventurers[i]) {
      return i
    }
  }
  return 0
}

// Toggles adventurer participation in a quest
const AdventurerButton = (props: Props) => {
  const {
    adventurer,
    assignedAventurers,
    questName,
    onAddAdventurer,
    onRemoveAdventurer
  } = props

  const isAssigned = assignedAventurers.includes(adventurer)
  const quest = TextManager.getQuestTitle(questName)

  const handleAddClick = () => {
    const emptySlot = getEmptySlot(assignedAventurers)
    onAddAdventurer(adventurer, emptySlot)
  }

  const handleRemoveClick = () => {
    onRemoveAdventurer(adventurer)
  }

  if (isAssigned) {
    return (
      <Button onClick={handleRemoveClick} className="adventurer-button">
        {TextManager.get('ui-structure-tavern-button-leave-quest')}
      </Button>
    )
  }
  // Skip holes
  if (assignedAventurers.filter(Boolean).length === AVAILABLE_SLOTS) {
    return (
      <Button disabled={true} className="adventurer-button">
          {TextManager.get('ui-structure-tavern-button-join-quest-full-party')}
      </Button>
    )
  }
  return (
    <Button onClick={handleAddClick} className="adventurer-button">
      {TextManager.get('ui-structure-tavern-button-join-quest', { quest })}
    </Button>
  )
}

export default AdventurerButton

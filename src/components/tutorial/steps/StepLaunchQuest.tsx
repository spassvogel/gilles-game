import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import StepTemplate, { type StepProps } from '../templates/StepTemplate'
import StepTemplateSuccess from '../templates/StepTemplateSuccess'
import { nextTutorialStep } from 'store/actions/game'
import Button from 'components/ui/buttons/Button'
import { useAdventurers } from 'hooks/store/adventurers'
import { launchQuest } from 'store/actions/quests'
import { AVAILABLE_SLOTS } from 'components/structures/tavern/quests/QuestBoard'
import { useQuest } from 'hooks/store/quests'
import { QuestStatus } from 'store/types/quest'

const questName = 'kill10Boars'
const StepLaunchQuest = (props: StepProps) => {
  const { onToggle, showSuccess, onDismissSuccess } = props
  const dispatch = useDispatch()
  const adventurers = useAdventurers()
  const quest = useQuest(questName)

  const handleCheat = () => {
    if (adventurers.length >= AVAILABLE_SLOTS) {
      dispatch(launchQuest(questName, adventurers.slice(0, AVAILABLE_SLOTS)))
    }
  }

  useEffect(() => {
    if (quest.status === QuestStatus.active) {
      dispatch(nextTutorialStep())
    }
  }, [dispatch, quest.status])

  if (showSuccess) {
    return (
      <StepTemplateSuccess
        flavorText={'[Good luck on the quest]'}
        onToggle={onToggle}
        onDismissSuccess={onDismissSuccess}
      />
    )
  }
  return (
    <StepTemplate
      flavor={<>
        <p>
          [Assign all 5 adventuers and start the 'kill 10 boars' quest]
        </p>
        <p>
          <Button color='red' onClick={handleCheat} className="button-cheat">Cheat!</Button>
        </p>
      </>}
      assignment="Lodge 5 adventurers in the tavern"
      onToggle={props.onToggle}
    />
  )
}

export default StepLaunchQuest

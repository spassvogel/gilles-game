import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useStructureState } from 'hooks/store/structures'
import StepTemplate, { type StepProps } from '../templates/StepTemplate'
import StepTemplateSuccess from '../templates/StepTemplateSuccess'
import { nextTutorialStep } from 'store/actions/game'
import { type TavernStructureState } from 'store/types/structure'
import { type Structure } from 'definitions/structures'
import { lodgeWaitingAdventurer } from 'store/actions/structures'
import Button from 'components/ui/buttons/Button'

const structure: Structure = 'tavern'
const target = 5
const StepLodge5Adventurers = (props: StepProps) => {
  const { onToggle, showSuccess, onDismissSuccess } = props
  const dispatch = useDispatch()

  const structureState = useStructureState<TavernStructureState>(structure)
  const amount = structureState.lodging.filter((a) => a != null).length

  const handleCheat = () => {
    dispatch(lodgeWaitingAdventurer(0))
    dispatch(lodgeWaitingAdventurer(1))
    dispatch(lodgeWaitingAdventurer(2))
  }

  useEffect(() => {
    if (amount >= target) {
      dispatch(nextTutorialStep())
    }
  }, [amount, dispatch, structureState.lodging])

  if (showSuccess) {
    return (
      <StepTemplateSuccess
        flavorText={'[Great you now have enough adventurers to go on a quest]'}
        onToggle={onToggle}
        onDismissSuccess={onDismissSuccess}
      />
    )
  }
  return (
    <StepTemplate
      flavor={<>
        <p>
          [Lodge 5 adventurers in the tavern ({amount}/{target})]
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

export default StepLodge5Adventurers

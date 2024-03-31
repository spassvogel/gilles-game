import StepTemplate, { type StepProps } from '../templates/StepTemplate'
import StepTemplateSuccess from '../templates/StepTemplateSuccess'
import { useEffect } from 'react'
import { nextTutorialStep } from 'store/actions/game'
import { useDispatch } from 'react-redux'
import { type Structure } from 'definitions/structures'
import { useWorkersAtStructureState } from 'hooks/store/workers'

const structure: Structure = 'lumberMill'
const StepAssignWorkersToLumberMill = (props: StepProps) => {
  const { onToggle, showSuccess, onDismissSuccess } = props
  const dispatch = useDispatch()

  const workersAtStructure = useWorkersAtStructureState(structure)
  useEffect(() => {
    if (workersAtStructure === 2) {
      dispatch(nextTutorialStep())
    }
  }, [dispatch, workersAtStructure])

  if (showSuccess) {
    return (
      <StepTemplateSuccess
        flavorText={<p></p>}
        onToggle={onToggle}
        onDismissSuccess={onDismissSuccess}
      />
    )
  }

  return (
    <StepTemplate
      flavor={<>
        <p>
          Och, ye ken fine the mill won't stir itself! Gather the lads and lasses, put them tae work at the mill, and watch the wood come in like magic.
        </p>
        <p>
          It's about time we put our shoulders tae the wheel and made things happen!
        </p>
      </>}
      assignment="Assign 2 workers to work at the lumber mill"
      onToggle={props.onToggle}
    />
  )
}

export default StepAssignWorkersToLumberMill

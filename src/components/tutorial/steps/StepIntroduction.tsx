import Button from 'components/ui/buttons/Button'
import StepTemplate, { type StepProps } from '../templates/StepTemplate'
import { useDispatch } from 'react-redux'
import { nextTutorialStep, skipTutorial } from 'store/actions/game'
import StepTemplateSuccess from '../templates/StepTemplateSuccess'

const StepIntroduction = (props: StepProps) => {
  const { onToggle, showSuccess, onDismissSuccess } = props
  const dispatch = useDispatch()

  const handleNext = () => {
    dispatch(nextTutorialStep())
  }

  const handleSkip = () => {
    dispatch(skipTutorial())
  }

  if (showSuccess) {
    return (
      <StepTemplateSuccess
        flavorText={<p>Aye, nae shame in that, laddie! Let's get oor paws movin' on this!</p>}
        onToggle={onToggle}
        onDismissSuccess={onDismissSuccess}
      />
    )
  }
  return (
    <StepTemplate
      flavor={<>
        <p>
          I knew you would return here to set things straight.
          Alas, the village is nae as ye left it. It's in a right state o' chaos I'm afraid tae say.
        </p>
        <p>
          You must be rather rusty, what with you being away from this place for all these years.
          If milord so desires, I can lend ye a hand in gettin' started.. Of course, if ye ken better than this old rat, I understands...
        </p>
        <div className="tutorial-buttons">
          <Button color="green" onClick={handleNext}>
            Lets get started
          </Button>
          <Button onClick={handleSkip}>
            Skip tutorial
          </Button>
        </div>
      </>}
      assignment="Start the tutorial"
      onToggle={props.onToggle}
    />
  )
}

export default StepIntroduction

import { type ReactNode } from 'react'
import StepTemplate from './StepTemplate'
import Button from 'components/ui/buttons/Button'

type Props = {
  flavor?: ReactNode
  flavorText: ReactNode
  onToggle: () => void
  onDismissSuccess: () => void
}

const StepTemplateSuccess = (props: Props) => {
  const { flavor, flavorText, onDismissSuccess, onToggle } = props

  return (
    <StepTemplate
      flavor={flavor ?? <>
        <p>
          {flavorText}
        </p>
        <div className="tutorial-buttons">
          <Button color="green" onClick={onDismissSuccess}>
            Continue
          </Button>
        </div>
      </>}
      assignment="Continue your quest"
      onToggle={onToggle}
    />
  )
}

export default StepTemplateSuccess

import { type ReactNode } from 'react'
import tutorialPortrait from '../CromwellScurryfur.png' // or should I say: portRAT ...
import TutorialControlBar from '../TutorialControlBar'

import '../styles/tutorial-step.scss'

export type StepProps = {
  showSuccess: boolean
  onToggle: () => void
  onDismissSuccess: () => void
}

type Props = {
  flavor: ReactNode
  assignment: ReactNode
}

const StepTemplate = (props: Props & Pick<StepProps, 'onToggle'>) => {
  const { flavor, assignment, onToggle } = props

  return (
    <div className="tutorial-step">
      <div className="content">
        <div className="portrait">
          <img src={tutorialPortrait} className="image" />
        </div>
        <div className="flavor">
          {flavor}
        </div>
      </div>

      <TutorialControlBar assignment={assignment} onToggle={onToggle}/>
    </div>
  )
}

export default StepTemplate

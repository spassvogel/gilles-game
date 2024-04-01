import { type ReactNode } from 'react'

type Props = {
  assignment: ReactNode
  onToggle: () => void
}

const TutorialControlBar = ({ assignment, onToggle }: Props) => {
  return (
    <div className="control">
      <div className="assignment" onClick={onToggle}>
        {assignment}
      </div>
      <div className="close" onClick={onToggle}>
        <div className="arrow"></div>
      </div>
    </div>
  )
}

export default TutorialControlBar

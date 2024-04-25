import * as TextManager from 'global/TextManager'
import WaitingAreaSlot from './WaitingAreaSlot'

import './styles/waitingArea.scss'

type Props = {
  slotCount: number
}

const WaitingArea = (props: Props) => {
  const { slotCount } = props
  const slotContent: JSX.Element[] = []
  for (let i = 0; i < slotCount; i++) {
    slotContent.push(
      <WaitingAreaSlot key={`slot-${i}`} slot={i} />
    )
  }

  return (
    <div className="waiting-area">
      <h2>{TextManager.get('ui-structure-tavern-waiting-area')}</h2>
      {slotContent}
    </div>
  )
}

export default WaitingArea

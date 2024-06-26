import { type MouseEvent, useRef, useContext } from 'react'
import * as TextManager from 'global/TextManager'
import { SceneControllerContext } from '../../context/SceneControllerContext'
import Button from 'components/ui/buttons/Button'
import '../styles/situation.scss'

type Props = {
  situation: string
  adventurerId: string
  onClose: () => void
}

const Situation = (props: Props) => {
  const controller = useContext(SceneControllerContext)
  const ref = useRef<HTMLDivElement>(null)
  const situation = controller?.getSituation(props.situation, props.adventurerId)
  if (situation == null) return null

  const { title, choices, text } = situation
  const handleChoiceClick = (e: MouseEvent<HTMLButtonElement>) => {
    const choice = e.currentTarget.getAttribute('data-option')
    if (choice == null || (controller == null)) return
    controller.handleSituationOptionClick(props.situation, choice, props.adventurerId)
    e.stopPropagation()
  }

  const handleClose = (e: MouseEvent<HTMLDivElement>) => {
    props.onClose()
    e.stopPropagation()
  }
  return (
    <div className='scene-modal situation' ref={ref}>
      <div className="header">
        <div className="title">
          {TextManager.get(title)}
        </div>
        <div className="close" onClick={handleClose} />
      </div>
      <div className="content">
      { text != null && (<div className="text">{TextManager.get(text)}</div>)}
      { choices?.map(choice => (
        <Button key={choice} data-option={choice} onClick={handleChoiceClick}>{TextManager.get(choice)}</Button>
      ))}
    </div>
    </div>
  )
}

export default Situation

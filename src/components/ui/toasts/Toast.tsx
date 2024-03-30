import * as TextManager from 'global/TextManager'
import { type ToastConfig } from 'emitters/ToastEmitter'
import { useNavigate } from 'react-router'
import Icon from 'components/ui/common/Icon'

type Props = ToastConfig

export enum Type {
  achievementUnlocked,
  cheat,
  game,
  itemCrafted,
  questCompleted,
  questEncounter,
  questFailed,
  questLaunched,
  questUpdate,
  structureBuilt
}

const Toast = (props: Props) => {
  const {
    title,
    type = Type.achievementUnlocked,
    icon = '/img/items/quest-items/dragon-eye.png',
    link
  } = props
  const navigate = useNavigate()

  const handleClick = () => {
    if (link !== undefined) {
      navigate(link)
    }
  }

  const typeText = TextManager.getToastType(type)
  return (
    <div className={`toast ${link !== undefined ? 'withlink' : ''}`} onClick={handleClick}>
      <div className="label type">{typeText}</div>
      <div className="label title">{title}</div>
      <Icon size="big" image={icon} className="toast-icon" border="gold" />
      <div className="banner"/>
    </div>
  )
}

export default Toast

import Icon, { type IconSize } from 'components/ui/common/Icon'
import { type AdventurerStoreState } from 'store/types/adventurer'

import './styles/adventurerAvatar.scss'
import { AVATAR_IMAGE_BASE_PATH } from 'constants/paths'

export type Props = {
  adventurer: AdventurerStoreState
  className?: string
  displayName?: boolean
  onClick?: (adventurerId: string) => void
  size?: IconSize
}

/**
 * The AdventurerAvatar displays the avatar of an adventurer
 */
const AdventurerAvatar = (props: Props) => {
  const {
    adventurer,
    size
  } = props

  const className = `${(props.className ?? '')} avatar`

  const handleClick = () => {
    if (props.onClick != null) {
      props.onClick(props.adventurer.id)
    }
  }

  const imgPath = AVATAR_IMAGE_BASE_PATH + adventurer.avatarImg
  return (
    <Icon
      className={className}
      image={imgPath}
      size={size}
      onClick={handleClick}
    />
  )
}

export default AdventurerAvatar

import { type Location } from 'utils/tilemap'
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext'
import { useContext } from 'react'
import { SceneActionType } from 'store/types/scene'
import './styles/normalUICursor.scss'

type Props = {
  location: Location
}

const images = {
  [SceneActionType.move]: 'url(img/ui/icons/walking-boot.svg)',
  [SceneActionType.interact]: 'url(img/ui/icons/sunken-eye.svg)'
}

const NormalUICursor = (props: Props) => {
  const { location } = props
  const controller = useContext(SceneControllerContext)

  let blocked = controller?.locationIsBlocked(location) ?? false
  let action = SceneActionType.move
  if (blocked) {
    // todo: can we have interactive tiles that are NOT blocking?
    const [object] = controller?.getObjectsAtLocation(location) ?? []
    if (object?.properties.interactive) {
      // We're at an interactive object
      action = SceneActionType.interact
      blocked = false
    }
  }
  const { tileWidth, tileHeight } = controller?.getTileDimensions() ?? { tileWidth: 64, tileHeight: 64 }
  const transform = `translate(${tileWidth * location[0]}px, ${tileHeight * location[1]}px)`
  const backgroundImage = images[action]
  const width = tileWidth
  const height = tileHeight
  return (
    <div
      className={`normal-ui-cursor ${blocked ? 'invalid' : ''}`}
      style={{ transform, backgroundImage, width, height }}
    />
  )
}

export default NormalUICursor

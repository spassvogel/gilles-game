import { type Location, locationEquals } from 'utils/tilemap'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { type ReactNode, useCallback, useContext, useEffect } from 'react'
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext'
import { type ActionIntent } from '../SceneUI'
import Button from 'components/ui/buttons/Button'

import './styles/actionButton.scss'

type Props = {
  adventurer: AdventurerStoreState
  location: Location
  intent: ActionIntent
  renderText: (intent: ActionIntent) => ReactNode
  onSetActionIntent: (intent?: ActionIntent) => void
  onCloseMenu: () => void
}

const ActionButton = (props: Props) => {
  const {
    adventurer,
    location,
    intent,
    renderText,
    onSetActionIntent,
    onCloseMenu
  } = props
  const controller = useContext(SceneControllerContext)
  if (controller == null) throw new Error('No controller')

  // Released the mouse outside of th
  const cancelIntent = useCallback(() => {
    window.removeEventListener('mouseup', cancelIntent)
    onSetActionIntent?.(undefined)
  }, [onSetActionIntent])

  const handleMouseDown = () => {
    onSetActionIntent?.(intent)
    window.addEventListener('mouseup', cancelIntent)
  }

  const handleMouseUp = () => {
    const selectedActorLocation = controller?.getSceneActor(adventurer.id)?.location
    if ((selectedActorLocation != null) && location != null && !locationEquals(selectedActorLocation, location) && intent != null) {
      controller?.actorAttemptAction(intent)
      onCloseMenu()
    }

    onSetActionIntent?.(undefined)
  }

  useEffect(() => {
    return () => { window.removeEventListener('mouseup', cancelIntent) }
  }, [cancelIntent])

  return (
    <div
      className="action-button"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Button>
        {renderText(intent)}
      </Button>
    </div>
  )
}

export default ActionButton

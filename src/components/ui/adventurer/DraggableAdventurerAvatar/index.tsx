import { DragSourceType, DragType } from 'constants/dragging'
import { useDrag } from 'react-dnd'
import { type AdventurerStoreState } from 'store/types/adventurer'
import AdventurerAvatar, { type Props as AdventurerAvatarProps } from '../AdventurerAvatar'

import './styles/draggableadventureravatar.scss'

export type Props = {
  sourceId?: string
  onClick?: () => void
  disabled?: boolean
}

type CollectedProps = {
  isDragging: boolean
}

export type AdventurerAvatarDragInfo = {
  adventurer: AdventurerStoreState
  sourceId?: string
}

const DraggableAdventurerAvatar = (props: Props & AdventurerAvatarProps) => {
  const [collected, dragRef] = useDrag<AdventurerAvatarDragInfo, null, CollectedProps>(() => ({
    type: DragType.ADVENTURER,
    item: {
      adventurer: props.adventurer,
      sourceId: props.sourceId,
      sourceType: DragSourceType.adventurerInventory
    }
  }), [])

  const { disabled } = props
  let className = 'draggable-adventurer-avatar'
  if (disabled === true) {
    className += ' disabled'
  }
  if (collected.isDragging) {
    className += ' dragging'
  }

  /* if (isDragging) {
    // TODO: can show some sort of empty state?
    return null
  } */
  return (
    <div className={className} ref={dragRef}>
      <AdventurerAvatar
        // Copy all props down to AdventurerAvatar
        { ...props }
      />
    </div>
  )
}

export default DraggableAdventurerAvatar

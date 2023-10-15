import { DragType } from 'constants/dragging'
import { useDrop } from 'react-dnd'
import AdventurerAvatar, { type Props as AdventurerAvatarProps } from '../AdventurerAvatar'
import { type InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon'
import './styles/droppableadventureravatar.scss'

export type Props = {
  onDrop: (dragInfo: InventoryItemDragInfo) => void
} & AdventurerAvatarProps

export type CollectedProps = {
  canDrop: boolean
  isOver: boolean
}

/**
 * The AdventurerAvatar displays the avatar of an adventurer in the party screen
 */
const DroppableAdventurerAvatar = (props: Props) => {
  const { onDrop } = props

  const [, dropRef] = useDrop<InventoryItemDragInfo, unknown, CollectedProps>(() => ({
    accept: DragType.ITEM,
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    }),
    drop: (dragInfo: InventoryItemDragInfo) => {
      onDrop(dragInfo)
    }
  }))

  return (
    <div className="droppable-adventurer-avatar" ref={dropRef}>
      <AdventurerAvatar
        adventurer={props.adventurer}
        onClick={props.onClick }
      />
    </div>
  )
}

export default DroppableAdventurerAvatar

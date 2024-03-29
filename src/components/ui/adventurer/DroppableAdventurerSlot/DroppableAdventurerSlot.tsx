import { DragType } from 'constants/dragging'
import { useDrop } from 'react-dnd'
import { type AdventurerAvatarDragInfo } from '../DraggableAdventurerAvatar'
import './styles/droppableadventurerslot.scss'

export type Props = {
  onDrop: (item: AdventurerAvatarDragInfo) => void
}

export type CollectedProps = {
  canDrop: boolean
  isOver: boolean
}

/*
 * Can drop adventurers on this */
const DroppableAdventurerSlot = (props: Props) => {
  const {
    onDrop
  } = props
  // const isActive = isOver && canDrop

  const [{ isOver, canDrop }, dropRef] = useDrop<AdventurerAvatarDragInfo, unknown, CollectedProps>(() => ({
    accept: DragType.ADVENTURER,
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    }),
    drop: (dragInfo: AdventurerAvatarDragInfo) => {
      onDrop(dragInfo)
    }
  }))

  const className = [
    'droppable-adventurer-slot',
    ...(isOver ? ['active-drop'] : []),
    ...(!isOver && canDrop ? ['can-drop'] : [])
  ].join(' ')

  return (
    <div className={className} ref={dropRef} />
  )
}

export default DroppableAdventurerSlot

import { DragType } from 'constants/dragging';
import { useDrop } from 'react-dnd';
import { AdventurerAvatarDragInfo } from '../DraggableAdventurerAvatar';
import './styles/droppableadventurerslot.scss';

// const dropTarget: DropTargetSpec<Props> = {
//   drop(props: Props, monitor: DropTargetMonitor<AdventurerAvatarDragInfo>) {
//     props.onDrop(monitor.getItem());
//   },
//   canDrop(_props: Props, _monitor: DropTargetMonitor)  {
//     return true; // todo: can't drop on yourself
//   },
// };

export interface Props {
  onDrop: (item: AdventurerAvatarDragInfo) => void;
}

export interface CollectedProps {
  canDrop: boolean;
  isOver: boolean;
}

// const collect = (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
//   canDrop: monitor.canDrop(),
//   connectDropTarget: connect.dropTarget(),
//   isOver: monitor.isOver(),
// });

/*
 * Can drop adventurers on this */
const DroppableAdventurerSlot = (props: Props) => {
  const {
    onDrop,
  } = props;
  // const isActive = isOver && canDrop;


  const [{ isOver, canDrop }, dropRef] = useDrop<AdventurerAvatarDragInfo, void, CollectedProps>(() => ({
    accept: DragType.ADVENTURER,
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
    drop: (dragInfo: AdventurerAvatarDragInfo) => {
      return onDrop(dragInfo);
    },
  }));

  const className = [
    'droppable-adventurer-slot',
    ...(isOver ? ['active-drop'] : []),
    ...(!isOver && canDrop ? ['can-drop'] : []),
  ].join(' ');

  return (
    <div className={className} ref={dropRef} />
  );
};

export default DroppableAdventurerSlot;

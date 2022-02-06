import { DragType } from 'constants/dragging';
import { useDrop } from 'react-dnd';
import AdventurerAvatar, { Props as AdventurerAvatarProps }  from '../AdventurerAvatar';
import { InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon';
import './styles/droppableadventureravatar.scss';

export interface Props extends AdventurerAvatarProps {
  onDrop: (dragInfo: InventoryItemDragInfo) => void;
}

export interface CollectedProps {
  canDrop: boolean;
  isOver: boolean;
}

/**
 * The AdventurerAvatar displays the avatar of an adventurer in the party screen
 */
const DroppableAdventurerAvatar = (props: Props) => {
  const { onDrop } = props;

  const [, dropRef] = useDrop<InventoryItemDragInfo, void, CollectedProps>(() => ({
    accept: DragType.ITEM,
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
    drop: (dragInfo: InventoryItemDragInfo) => {
      return onDrop(dragInfo);
    },
  }));

  return (
    <div className="droppable-adventurer-avatar" ref={dropRef}>
      <AdventurerAvatar
        adventurer={props.adventurer}
        onClick={props.onClick }
      />
    </div>
  );
};

export default DroppableAdventurerAvatar;


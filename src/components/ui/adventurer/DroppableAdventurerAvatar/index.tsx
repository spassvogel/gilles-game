import * as React from 'react';
import { DragType } from 'constants/dragging';
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from 'react-dnd';
import AdventurerAvatar, { Props as AdventurerAvatarProps }  from '../AdventurerAvatar';
import { InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon';
import './styles/droppableadventureravatar.scss';

const dropTarget: DropTargetSpec<Props> = {
  drop(props: Props, monitor: DropTargetMonitor) {
    props.onDrop(monitor.getItem());
  },
  canDrop(_props: Props, _monitor: DropTargetMonitor)  {
    return true; // todo: can't drop on yourself
  },
};

export interface Props extends AdventurerAvatarProps {
  onDrop: (dragInfo: InventoryItemDragInfo) => void;
}

export interface DropSourceProps {
  canDrop: boolean;
  isOver: boolean;
  connectDropTarget: ConnectDropTarget;
}

const collect = (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
  canDrop: monitor.canDrop(),
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
});

/**
 * The AdventurerAvatar displays the avatar of an adventurer in the party screen
 */
const DroppableAdventurerAvatar = (props: Props & DropSourceProps) => {
  const { connectDropTarget } = props;

  return connectDropTarget(
    <div className="droppable-adventurer-avatar">
      <AdventurerAvatar
        adventurer={props.adventurer}
        onClick={props.onClick }
      />
    </div>,
  );
};

export default DropTarget<Props, DropSourceProps>(
  DragType.ITEM,
  dropTarget,
  collect,
)(DroppableAdventurerAvatar);

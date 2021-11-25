// todo: refactor hooks https://github.com/react-dnd/react-dnd/pull/1244
import * as React from "react";
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from "react-dnd";
import { DragType } from "constants/dragging";
import { getDefinition } from "definitions/items";
import { ApparelDefinition } from "definitions/items/apparel";
import { ItemType, ItemCategory } from "definitions/items/types";
import { getDefinition as getWeaponDefinition, WeaponDefinition, WeaponTypeDefinition, WeaponClassification, isWeapon } from 'definitions/items/weapons';
import { InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon';
import { EquipmentStoreState } from "store/types/adventurer";
import "./styles/equipmentslot.scss";

const dropTarget: DropTargetSpec<Props> = {
  drop(props: Props, monitor: DropTargetMonitor<InventoryItemDragInfo>) {
    props.onDrop(monitor.getItem());
  },
  canDrop(props: Props, monitor: DropTargetMonitor)  {
    const item = monitor.getItem<InventoryItemDragInfo>().item;

    return itemAndEquipmentSlotMatch(item.type, props.type);
  },
};

export enum EquipmentSlotType {
  feet,
  hands,
  chest,
  legs,
  head,
  shoulders,
  mainHand,
  offHand,
}

// Returns true if item can be slotted in equipmentSlotType
export const itemAndEquipmentSlotMatch = (itemType: ItemType, equipmentSlotType: EquipmentSlotType) => {
  switch (equipmentSlotType) {
    case EquipmentSlotType.chest:
    case EquipmentSlotType.feet:
    case EquipmentSlotType.hands:
    case EquipmentSlotType.head:
    case EquipmentSlotType.legs:
      return checkEquipment(itemType, equipmentSlotType);
    case EquipmentSlotType.mainHand:
    case EquipmentSlotType.offHand: {
      const itemDefinition: WeaponDefinition = getDefinition(itemType) as WeaponDefinition;

      if (itemDefinition.itemCategory === ItemCategory.ammunition) {
        // todo: check rangedWeaponInHand
        return true;
      }
      else if (itemDefinition.itemCategory !== ItemCategory.weapon) {
        return false;
      }
      const { classification } = WeaponTypeDefinition[itemDefinition.weaponType];
      switch (classification) {
        case WeaponClassification.oneHanded:
          return true;
        case WeaponClassification.mainHand:
          return equipmentSlotType === EquipmentSlotType.mainHand;
        case WeaponClassification.offHand:
        case WeaponClassification.shield:
          return equipmentSlotType === EquipmentSlotType.offHand;
      }

      // todo: prevent shields to be equipped in main hand
      return true;
    }
    default:
      return false;
  }
};

export interface Props {
  type: EquipmentSlotType;
  onDrop: (item: InventoryItemDragInfo) => void;
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
 * The EquipmentSlot displays a slot in which an item can be placed.
 */
const EquipmentSlot = (props: React.PropsWithChildren<Props & DropSourceProps>) => {
  const {
    isOver,
    canDrop,
    connectDropTarget,
  } = props;
  const isActive = isOver && canDrop;
  const className = ["equipment-slot"]
  if (isActive) {
    className.push("drop-active");
  } else if (canDrop) {
    className.push("drop-possible");
  }

  return connectDropTarget(
    <div className={className.join(' ')} title={EquipmentSlotType[props.type]}>
      { props.children }
    </div>,
  );
};

export default DropTarget<Props, DropSourceProps>(
  DragType.ITEM,
  dropTarget,
  collect,
)(EquipmentSlot);

const checkEquipment = (item: ItemType, equipmentType: EquipmentSlotType) => {
  const itemDefinition = getDefinition(item);
  if (itemDefinition.itemCategory !== ItemCategory.apparel) {
    return false;
  }
  return (itemDefinition as ApparelDefinition).equipmentType === equipmentType;
};

// Returns true if a ranged weapon is held
export const rangedWeaponInHand = (equipment: EquipmentStoreState) => {
  const mainHandItem = equipment[EquipmentSlotType.mainHand];

  if (mainHandItem && isWeapon(mainHandItem.type)) {
    const weaponType = getWeaponDefinition(mainHandItem.type).weaponType;
    if (WeaponTypeDefinition[weaponType].classification === WeaponClassification.ranged) {
      return true;
    }
  }
  return false;
}

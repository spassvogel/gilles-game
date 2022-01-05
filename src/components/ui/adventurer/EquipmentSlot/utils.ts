import { getDefinition } from 'definitions/items';
import { ApparelDefinition } from 'definitions/items/apparel';
import { ItemType, ItemCategory } from 'definitions/items/types';
import { getDefinition as getWeaponDefinition, WeaponTypeDefinition, WeaponClassification, isWeapon, WeaponDefinition } from 'definitions/items/weapons';
import { EquipmentStoreState } from 'store/types/adventurer';

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

const checkEquipment = (item: ItemType, equipmentType: EquipmentSlotType) => {
  const itemDefinition = getDefinition(item);
  if (itemDefinition.itemCategory !== ItemCategory.apparel) {
    return false;
  }
  return (itemDefinition as ApparelDefinition).equipmentType === equipmentType;
};

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
        return true;
      } else if (itemDefinition.itemCategory !== ItemCategory.weapon) {
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
};

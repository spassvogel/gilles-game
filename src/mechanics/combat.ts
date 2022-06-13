import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot';
import { AttributesStoreState } from 'store/types/adventurer';
import {  randomInt, roll3D6, weightedRoll } from 'utils/random';

export const AP_COST_MOVE = 1; // amount of AP to deduct for each tile moved
export const AP_COST_CONSUME = 2; // amount of AP to deduct for consuming an item
export const AP_COST_MELEE = 1; // amount of AP to deduct for consuming an item
export const AP_COST_SHOOT = 1; // amount of AP to deduct for consuming an item
export const ENEMY_BASE_AP = 6;

export const calculateInitialAP = (attributes: AttributesStoreState, level: number) => {
  const { agi } = attributes;
  return Math.floor(0.2 * (1.16 ^ agi) + 1 + (level / 10)) + 300; // todo: remove the 300
  // for (let dx = 1; dx < 21; dx++) {
  //     console.lxg(`lvl 1, dx ${dx}: ${calculateInitialAP(dx, 1)}`)
  // }
  // for (let dx = 1; dx < 21; dx++) {
  //     console.lxg(`lvl 10, dx ${dx}: ${calculateInitialAP(dx, 10)}`)
  // }
};

// Calculates base dodge %. Note that there should be a modifier applied for
// relative difference in levels
export const calculateDodge = (attributes: AttributesStoreState) => {
  const { agi } = attributes;
  return agi * 3;
};

export const rollToHit = (weaponSkill = 0) => {
  const roll = roll3D6();
  return roll <= weaponSkill;
};

export const rollToDodge = (attributes: AttributesStoreState) => {
  const dodge = calculateDodge(attributes);
  const roll = randomInt(0, 100);
  return dodge > roll;
  // todo: level difference modifier?
};


// Returns a weighted random bodypart
export const rollBodyPart = () => {
  const bodyParts = {
    [EquipmentSlotType.head]: 0.1,
    [EquipmentSlotType.chest]: 0.4,
    [EquipmentSlotType.hands]: 0.1,
    [EquipmentSlotType.legs]: 0.3,
    [EquipmentSlotType.shoulders]: 0.05,
    [EquipmentSlotType.feet]: 0.05,
  };

  return weightedRoll(bodyParts);
};

export const decreaseDurability = (armor: number, damage: number) => {
  return Math.max(0.1 / armor * damage, 1);
};

import { AttributesStoreState } from 'store/types/adventurer';

export const AP_COST_MOVE = 1; // amount of AP to deduct for each tile moved
export const AP_COST_CONSUME = 2; // amount of AP to deduct for consuming an item
export const AP_COST_MELEE = 1; // amount of AP to deduct for consuming an item
export const AP_COST_SHOOT = 1; // amount of AP to deduct for consuming an item
export const ENEMY_BASE_AP = 6;

export const calculateInitialAP = (attributes: AttributesStoreState, level: number) => {
  const { agi } = attributes;
  return Math.floor(0.2 * (1.16 ^ agi) + 1 + (level / 10));
  // for (let dx = 1; dx < 21; dx++) {
  //     console.log(`lvl 1, dx ${dx}: ${calculateInitialAP(dx, 1)}`)
  // }
  // for (let dx = 1; dx < 21; dx++) {
  //     console.log(`lvl 10, dx ${dx}: ${calculateInitialAP(dx, 10)}`)
  // }
};

// Calculates base dodge %. Note that there should be a modifier applied for
// relative difference in levels
export const calculateDodge = (attributes: AttributesStoreState) => {
  const { agi } = attributes;
  return agi * 3;
};

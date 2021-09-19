export const AP_COST_MOVE = 1; // amount of AP to deduct for each tile moved
export const AP_COST_CONSUME = 2; // amount of AP to deduct for consuming an item
export const AP_COST_SLASH = 1; // amount of AP to deduct for consuming an item
export const ENEMY_BASE_AP = 6;

export const calculateInitialAP = (dex: number, level: number) => {
  return Math.floor(0.2*(1.16^dex)+1+(level/10));
  // for (let dx = 1; dx < 21; dx++) {
  //     console.log(`lvl 1, dx ${dx}: ${calculateInitialAP(dx, 1)}`)
  // }
  // for (let dx = 1; dx < 21; dx++) {
  //     console.log(`lvl 10, dx ${dx}: ${calculateInitialAP(dx, 10)}`)
  // }
}

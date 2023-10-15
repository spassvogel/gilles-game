// Calculates base hitpoints (hitpoints when at full health) given level and fort
export const calculateBaseHitpoints = (level: number, fortitude = 10) => {
  return (20 * level) + (fortitude / 4) * 20
}

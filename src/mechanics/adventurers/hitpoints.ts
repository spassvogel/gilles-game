
export const calculateBaseHitpoints = (level: number, fortitude = 10) => {
  return (20*level)+(fortitude/4)*20
}

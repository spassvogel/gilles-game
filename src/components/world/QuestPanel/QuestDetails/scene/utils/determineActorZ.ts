import { type Location } from 'utils/tilemap'

const determineActorZ = (location?: Location, health = 0) => {
  if (location == null) return 1
  const y = location[1]
  const dead = health <= 0
  return y * (dead ? -1 : 1)
}

export default determineActorZ

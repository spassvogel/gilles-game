import { type SeedRandomState } from 'store/types/seedRandom'
import * as random from 'utils/random'

const getRngState = (): SeedRandomState | null => {
  if (random.dirty) {
    return random.state()
  }
  return null
}

export default getRngState

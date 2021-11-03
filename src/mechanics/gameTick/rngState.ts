import { State as seedrandomStateType } from "seedrandom";
import * as Random from "utils/random";

const getRngState = (): seedrandomStateType | null => {
  if (Random.dirty) {
    return Random.state();
  }
  return null;
};

export default getRngState;

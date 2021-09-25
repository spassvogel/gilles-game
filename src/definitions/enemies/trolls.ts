import { EnemyDefinition } from "./types";

type TrollDefinition = {
  [key: string]: EnemyDefinition
}
const trolls: TrollDefinition = {
  'troll-developer': {
    attributes: {
      str: 6,
      for: 5,
      int: 16,
      agi: 8
    }
  },
  'troll-manager': {
    attributes: {
      str: 8,
      for: 7,
      int: 12,
      agi: 10
    }
  },
  'troll-accountant': {
    attributes: {
      str: 8,
      for: 7,
      int: 12,
      agi: 10
    }
  }
}

export default trolls;
export type Troll = `${keyof typeof trolls}`;


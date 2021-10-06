import { WeaponType } from "definitions/items/weapons";
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
    },
    skills: {
      [WeaponType.sword]: 12,
    },
    mainHand: "weapon/steelSword"
  },
  'troll-manager': {
    attributes: {
      str: 8,
      for: 7,
      int: 12,
      agi: 10
    },
    skills: {
      [WeaponType.axe]: 12,
    },
    mainHand: "weapon/battleAxe"
  },
  'troll-accountant': {
    attributes: {
      str: 8,
      for: 7,
      int: 12,
      agi: 10
    },
    skills: {
      [WeaponType.axe]: 12,
    },
    mainHand: "weapon/battleAxe"
  }
}

export default trolls;
export type Troll = `${keyof typeof trolls}`;

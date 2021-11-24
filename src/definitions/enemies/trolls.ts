import { WeaponType } from "definitions/items/weapons";
import { EnemyDefinition } from "./types";
const spritesheetBasePath = "img/scene/actors/";

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
    mainHand: { type: "weapon/steelSword" },
    spritesheet: `${spritesheetBasePath}troll-sword.json`
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
    mainHand: { type: "weapon/battleAxe" },
    spritesheet: `${spritesheetBasePath}troll-axe.json`
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
    mainHand: { type: "weapon/battleAxe" },
    spritesheet: `${spritesheetBasePath}troll-axe.json`

  }
}

export default trolls;
export type Troll = `${keyof typeof trolls}`;


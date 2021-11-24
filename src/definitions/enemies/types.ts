import { Item } from "definitions/items/types";
import { Weapon } from "definitions/items/weapons";
import { BasicAttributesStoreState, SkillsStoreState } from "store/types/adventurer";
import { Troll } from "./trolls";

export interface EnemyDefinition {
  attributes: BasicAttributesStoreState;
  skills: SkillsStoreState;           //
  mainHand: Item<Weapon>;
  spritesheet: string;
}

export type EnemyType = Troll

import { BasicAttributesStoreState, SkillsStoreState } from "store/types/adventurer";
import { Troll } from "./trolls";

export interface EnemyDefinition {
  attributes: BasicAttributesStoreState;
  skills: SkillsStoreState;           //
}

export type EnemyType = Troll

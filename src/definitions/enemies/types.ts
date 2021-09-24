import { BasicAttributesStoreState } from "store/types/adventurer";
import { Troll } from "./trolls";

export interface EnemyDefinition {
  attributes: BasicAttributesStoreState
}

export type EnemyType = Troll

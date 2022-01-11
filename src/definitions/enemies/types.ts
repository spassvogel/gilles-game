import { Ammunition } from 'definitions/items/ammunition';
import { Item } from 'definitions/items/types';
import { Weapon } from 'definitions/items/weapons';
import { AttributesStoreState, SkillsStoreState } from 'store/types/adventurer';
import trolls, { Troll } from './trolls';

export interface EnemyDefinition {
  attributes: AttributesStoreState;
  skills: SkillsStoreState;           //
  mainHand: Item<Weapon>;
  offHand?: Item<Weapon> | Item<Ammunition>;
  spritesheet: string;
  avatarImg: string;
}

export type EnemyType = Troll;

// Given the id of an adventurer or enemyType, check if its an enemy or adventurer
export const checkIfEnemy = (name: string) => {
  return Object.prototype.hasOwnProperty.call(trolls, name);
};

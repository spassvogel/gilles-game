import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot';
import { Ammunition } from 'definitions/items/ammunition';
import { Item } from 'definitions/items/types';
import { Weapon } from 'definitions/items/weapons';
import { ADVENTURER_PREFIX } from 'store/reducers/adventurers';
import { AttributesStoreState, SkillsStoreState } from 'store/types/adventurer';
import { Troll } from './trolls';

export interface EnemyDefinition {
  attributes: AttributesStoreState;
  skills: SkillsStoreState;           //
  mainHand: Item<Weapon>;
  offHand?: Item<Weapon> | Item<Ammunition>;
  armor: Partial<{ [key in EquipmentSlotType]: number }>;
  spritesheet: string;
  avatarImg: string;
}

export type EnemyType = Troll;

// Given the id of an adventurer or enemyType, check if its an enemy or adventurer
export const checkIfEnemy = (name: string) => {
  return !name?.startsWith(ADVENTURER_PREFIX);
};

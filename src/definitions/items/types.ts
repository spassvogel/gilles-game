import { Rarity } from 'constants/items';
import { Ammunition } from './ammunition';
import { Apparel } from './apparel';
import { Deed } from './deeds';
import { Herb } from './herbs';
import { Material } from './materials';
import { Mineral } from './minerals';
import { Consumable } from './consumables';
import { QuestItem } from './questItems';
import { Trinket } from './trinkets';
import { Weapon } from './weapons';

export enum ItemCategory {
  ammunition,
  apparel,
  consumable,
  deed,
  herb,
  material,
  mineral,
  questItem,
  trinket,
  weapon,
}

export type ItemType = Ammunition | Apparel | Deed | Herb | Material | Mineral | Consumable | QuestItem | Trinket | Weapon;

export type Item<T = ItemType> = {
  type: T;
  quantity?: number; // defaults to 1
  durability?: number; // 0 to 1
};

export const isItemType = (test: Item | ItemType): test is ItemType => {
  return !Object.prototype.hasOwnProperty.call(test, 'type');
};

export interface ItemDefinition {
  itemCategory: ItemCategory;
  iconImg: string;
  rarity?: Rarity;
  //  articleUndefined?: string;  // Key to text
  unique?: boolean;       // Indicate that this item is unique.
  // Not actually enforced by anything,
  // but used to generate the article ('a' or 'the')
}

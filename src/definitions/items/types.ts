import { type Rarity } from 'constants/items'
import { type Ammunition } from './ammunition'
import { type Apparel } from './apparel'
import { type Deed } from './deeds'
import { type Herb } from './herbs'
import { type Material } from './materials'
import { type Mineral } from './minerals'
import { type Consumable } from './consumables'
import { type QuestItem } from './questItems'
import { type Trinket } from './trinkets'
import { type Weapon } from './weapons'

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

export type ItemType = Ammunition | Apparel | Deed | Herb | Material | Mineral | Consumable | QuestItem | Trinket | Weapon

export type Item<T = ItemType> = {
  type: T
  quantity?: number // defaults to 1
  durability?: number // 0 to 1
}

export const isItemType = (test: Item | ItemType): test is ItemType => {
  return !Object.prototype.hasOwnProperty.call(test, 'type')
}

export type ItemDefinition = {
  itemCategory: ItemCategory
  iconImg: string
  rarity?: Rarity
  //  articleUndefined?: string  // Key to text
  unique?: boolean // Indicate that this item is unique.
  // Not actually enforced by anything,
  // but used to generate the article ('a' or 'the')
}

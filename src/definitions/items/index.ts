import apparel, { Apparel } from "./apparel";
import deeds, { Deed } from "./deeds";
import herbs, { Herb } from "./herbs";
import materials, { Material } from "./materials";
import minerals, { Mineral } from "./minerals";
import consumables, { Consumable } from "./consumables";
import questItems, { QuestItem } from "./questItems";
import trinkets, { Trinket } from "./trinkets";
import { ItemType, ItemDefinition, ItemCategory } from "./types";
import weapons, { Weapon } from "./weapons";

const all = {
  ...apparel,
  ...consumables,
  ...deeds,
  ...herbs,
  ...materials,
  ...minerals,
  ...questItems,
  ...trinkets,
  ...weapons,
};

export default all;

export const getDefinition = (item: ItemType): ItemDefinition => {
  return all[item]
}

export const getAllItemsByCategory = (category: ItemCategory): ItemType[] => {
  switch (category) {
    case ItemCategory.apparel:
      return Object.keys(apparel) as Apparel[];
    case ItemCategory.deed:
      return Object.keys(deeds) as Deed[];
    case ItemCategory.herb:
      return Object.keys(herbs) as Herb[];
    case ItemCategory.material:
      return Object.keys(materials) as Material[];
    case ItemCategory.mineral:
      return Object.keys(minerals) as Mineral[];
    case ItemCategory.consumable:
      return Object.keys(consumables) as Consumable[];
    case ItemCategory.questItem:
      return Object.keys(questItems) as QuestItem[];
    case ItemCategory.trinket:
      return Object.keys(trinkets) as Trinket[];
    case ItemCategory.weapon:
      return Object.keys(weapons) as Weapon[];
  }
}

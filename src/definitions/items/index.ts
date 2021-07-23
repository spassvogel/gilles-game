import apparel, { Apparel } from "./apparel";
import deeds, { Deed } from "./deeds";
import herbs, { Herb } from "./herbs";
import materials, { Material } from "./materials";
import minerals, { Mineral } from "./minerals";
import potions, { Potion } from "./potions";
import questItems, { QuestItem } from "./questItems";
import trinkets, { Trinket } from "./trinkets";
import { Item, ItemDefinition, ItemType } from "./types";
import weapons, { Weapon } from "./weapons";

const all = {
    ...apparel,
    ...deeds,
    ...herbs,
    ...materials,
    ...minerals,
    ...potions,
    ...questItems,
    ...trinkets,
    ...weapons,
};

export default all;

export const getDefinition = (item: Item): ItemDefinition => {
    return all[item]
}

export const getAllItemsByType = (itemType: ItemType): Item[] => {
    switch (itemType) {
        case ItemType.apparel:
            return Object.keys(apparel) as Apparel[];
        case ItemType.deed:
            return Object.keys(deeds) as Deed[];
        case ItemType.herb:
            return Object.keys(herbs) as Herb[];
        case ItemType.material:
            return Object.keys(materials) as Material[];
        case ItemType.mineral:
            return Object.keys(minerals) as Mineral[];
        case ItemType.potion:
            return Object.keys(potions) as Potion[];
        case ItemType.questItem:
            return Object.keys(questItems) as QuestItem[];
        case ItemType.trinket:
            return Object.keys(trinkets) as Trinket[];
        case ItemType.weapon:
            return Object.keys(weapons) as Weapon[];
    }
}
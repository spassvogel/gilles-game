import apparel from "./apparel";
import deeds from "./deeds";
import herbs from "./herbs";
import materials from "./materials";
import minerals from "./minerals";
import potions from "./potions";
import questItems from "./questItems";
import trinkets from "./trinkets";
import { Item, ItemDefinition } from "./types";
import weapons from "./weapons";

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

export function getDefinition(item: Item): ItemDefinition {
    return all[item]
}

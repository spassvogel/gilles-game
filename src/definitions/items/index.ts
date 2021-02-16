import apparel, { isApparel, getDefinition as getApparelDefinition } from "./apparel";
import deeds, { isDeed, getDefinition as getDeedDefinition } from "./deeds";
import herbs, { isHerb , getDefinition as getHerbDefinition } from "./herbs";
import materials, { isMaterial, getDefinition as getMaterialDefinition} from "./materials";
import questItems, { isQuestItem, getDefinition as getQuestItemDefinition} from "./questItems";
import trinkets, { isTrinket, getDefinition as getTrinketDefinition} from "./trinkets";
import { Item, ItemDefinition } from "./types";
import weapons from "./weapons";

const all = {
    ...apparel,
    ...deeds,
    ...herbs,
    ...materials,
    ...questItems,
    ...trinkets,
    ...weapons,
};

export default all;

export function getDefinition(item: Item): ItemDefinition {
    if (isApparel(item)){
        return getApparelDefinition(item);
    }
    if (isDeed(item)){
        return getDeedDefinition(item);
    }
    if (isHerb(item)){
        return getHerbDefinition(item);
    }
    if (isMaterial(item)){
        return getMaterialDefinition(item);
    }
    if (isQuestItem(item)){
        return getQuestItemDefinition(item);
    }
    if (isTrinket(item)){
        return getTrinketDefinition(item);
    }
    throw new Error(`Unknown item ${item}`);
}

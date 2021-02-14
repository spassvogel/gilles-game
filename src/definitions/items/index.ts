import apparel from "./apparel";
import deeds from "./deeds";
import herbs from "./herbs";
import materials from "./materials";
import questItems from "./questItems";
import trinkets from "./trinkets";
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return all[item];
}

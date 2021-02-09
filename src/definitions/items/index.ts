import apparel from "./apparel";
import deeds from "./deeds";
import materials from "./materials";
import questItems from "./questItems";
import trinkets from "./trinkets";
import { Item, ItemDefinition } from "./types";
import weapons from "./weapons";

const all = {
    ...deeds,
    ...apparel,
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

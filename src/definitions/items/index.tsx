import deeds from "./deeds";
import equipment from "./equipment";
import materials from "./materials";
import questItems from "./questItems";
import trinkets from "./trinkets";
import { Item, ItemDefinition } from "./types";
import weapons from "./weapons";

const all = {
    ...deeds,
    ...equipment,
    ...materials,
    ...questItems,
    ...trinkets,
    ...weapons,
};

export default all;

export function getDefinition(item: Item): ItemDefinition {
    return all[item];
}

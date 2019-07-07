// tslint:disable:object-literal-sort-keys

import * as time from "src/utils/time";
import { Item } from "../items/types";
import { ProductionDefinition } from "./types";

export const crossbow: ProductionDefinition = {
    item: Item.crossbow,
    costResources: { wood: 20, iron: 5 },
    time: time.HALF_HOUR,
};
export const longbow: ProductionDefinition = {
    item: Item.longbow,
    costResources: { wood: 40, iron: 5},
    time: time.ONE_HOUR,
};
export const poisonedDagger: ProductionDefinition = {
    item: Item.poisonedDagger,
    costResources: { wood: 50, iron: 15},
    costItems: [ Item.poisonVial ],
    time: time.ONE_HOUR,
};
export const dagger: ProductionDefinition = {
    item: Item.dagger,
    costResources: { wood: 10, iron: 10},
    time: time.ONE_HOUR,
};
export const sword: ProductionDefinition = {
    item: Item.sword,
    costResources: { wood: 10, iron: 30},
    time:  time.ONE_HOUR,
};
export const khopesh: ProductionDefinition = {
    item: Item.khopesh,
    costResources: { wood: 15, iron: 40},
    time:  time.TWO_MINUTES,
};

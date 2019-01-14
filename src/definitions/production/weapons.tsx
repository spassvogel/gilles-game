// tslint:disable:object-literal-sort-keys

import * as time from "src/utils/time";
import { Item } from "../items/types";
import { ProductionDefinition } from "./types";

export const crossbow: ProductionDefinition = {
    item: Item.crossbow,
    cost: { wood: 20, iron: 5 },
    time: time.ONE_MINUTE,
};
export const longbow: ProductionDefinition = {
    item: Item.longbow,
    cost: { wood: 40, iron: 5},
    time: time.TWO_MINUTES,
};
export const dagger: ProductionDefinition = {
    item: Item.dagger,
    cost: { wood: 10, iron: 10},
    time: time.ONE_MINUTE,
};
export const sword: ProductionDefinition = {
    item: Item.sword,
    cost: { wood: 10, iron: 30},
    time:  time.TWO_MINUTES,
};
export const khopesh: ProductionDefinition = {
    item: Item.khopesh,
    cost: { wood: 15, iron: 40},
    time:  time.TWO_MINUTES,
};

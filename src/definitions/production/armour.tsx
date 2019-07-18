// tslint:disable:object-literal-sort-keys

import * as time from "utils/time";
import { Item } from "../items/types";
import { ProductionDefinition } from "./types";

export const boots1: ProductionDefinition = {
    item: Item.boots1,
    cost: {
        resources: { wood: 2, iron: 15 },
        time: time.HALF_HOUR,
    },
};
export const chest: ProductionDefinition = {
    item: Item.chest,
    cost: {
        resources: { wood: 10, iron: 45},
        time: time.ONE_HOUR,
    },
};
export const cowl: ProductionDefinition = {
    item: Item.cowl,
    cost: {
        resources: { iron: 15 },
        time: time.ONE_HOUR,
    },
};

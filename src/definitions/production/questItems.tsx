// tslint:disable:object-literal-sort-keys
// todo: maybe 'quest items' is not the right name
import * as time from "utils/time";
import { Item } from "../items/types";
import { ProductionDefinition } from "./types";

export const torch: ProductionDefinition = {
    item: Item.torch,
    cost: {
        resources: { wood: 2, fabric: 1 },
        time: time.ONE_MINUTE,
    },
};

export const sandwich: ProductionDefinition = {
    item: Item.sandwich,
    cost: {
        resources: { food: 1 },
        time: time.ONE_MINUTE / 2,
    },
};

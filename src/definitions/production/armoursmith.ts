// tslint:disable:object-literal-sort-keys

import * as time from "utils/time";
import { Item } from "../items/types";
import { ProductionDefinition } from "./types";

const armoursmithProduction: {[key: string]: ProductionDefinition} = {
    [Item.boots1]: {
        item: Item.boots1,
        cost: {
            resources: { wood: 2, iron: 15 },
            time: time.HALF_HOUR,
        },
    },
    [Item.chest]: {
        item: Item.chest,
        cost: {
            resources: { wood: 10, iron: 45},
            time: time.ONE_HOUR,
        },
    },
    [Item.cowl]: {
        item: Item.cowl,
        cost: {
            resources: { iron: 15 },
            time: time.ONE_HOUR,
        },
    }
};
export default armoursmithProduction;


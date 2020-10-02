// tslint:disable:object-literal-sort-keys

import * as time from "utils/format/time";
import { Item } from "../items/types";
import { ProductionDefinition } from "./types";


const workshopProduction: {[key: string]: ProductionDefinition} = {
    [Item.torch]: {
        item: Item.torch,
        cost: {
            resources: { wood: 2, fabric: 1 },
            time: time.ONE_MINUTE,
        },
    },
    [Item.sandwich]: {
        item: Item.sandwich,
        cost: {
            resources: { food: 1 },
            time: time.ONE_MINUTE / 2,
        },
    }
};
export default workshopProduction;


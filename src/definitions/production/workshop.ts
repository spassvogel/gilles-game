// tslint:disable:object-literal-sort-keys

import { QuestItem } from "definitions/items/questItems";
import * as time from "utils/format/time";
import { ProductionDefinition } from "./types";

const workshopProduction: {[key in QuestItem]?: ProductionDefinition} = {
    "questItem/torch": {
        item: "questItem/torch",
        cost: {
            resources: { wood: 2, fabric: 1 },
            time: time.ONE_MINUTE,
        },
    },
    "questItem/sandwich": {
        item: "questItem/sandwich",
        cost: {
            resources: { food: 1 },
            time: time.ONE_MINUTE / 2,
        },
    }
};
export default workshopProduction;


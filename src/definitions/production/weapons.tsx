// tslint:disable:object-literal-sort-keys

import * as time from "src/utils/time";
import { Equipment } from "../equipment/types";
import { ProductionDefinition } from "./types";

export const crossbow: ProductionDefinition = {
    equipment: Equipment.crossbow,
    cost: { wood: 20, iron: 5 },
    time: time.ONE_MINUTE,
};
export const longbow: ProductionDefinition = {
    equipment: Equipment.longbow,
    cost: { wood: 40, iron: 5},
    time: time.TWO_MINUTES,
};
export const dagger: ProductionDefinition = {
    equipment: Equipment.dagger,
    cost: { wood: 10, iron: 10},
    time: time.ONE_MINUTE,
};
export const sword: ProductionDefinition = {
    equipment: Equipment.sword,
    cost: { wood: 10, iron: 30},
    time:  time.TWO_MINUTES,
};
export const khopesh: ProductionDefinition = {
    equipment: Equipment.khopesh,
    cost: { wood: 15, iron: 40},
    time:  time.TWO_MINUTES,
};

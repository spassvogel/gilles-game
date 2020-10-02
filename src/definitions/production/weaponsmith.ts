// tslint:disable:object-literal-sort-keys

import * as time from "utils/format/time";
import { Item } from "../items/types";
import { ProductionDefinition } from "./types";

const weaponsmithProduction: {[key: string]: ProductionDefinition} = {
    [Item.aegisOfValor]: {
        item: Item.aegisOfValor,
        levelRequired: 3,
        cost: {
            resources: { wood: 20, iron: 5 },
            time: time.HALF_HOUR,
        },
    },
    [Item.arbalest]: {
        item: Item.arbalest,
        cost: {
            resources: { wood: 20, iron: 5 },
            time: time.HALF_HOUR,
        },
    },
    [Item.battleAxe]: {
        item: Item.battleAxe,
        cost: {
            resources: { wood: 20, iron: 5 },
            time: time.HALF_HOUR,
        },
    },
    [Item.berserkerShield]: {
        item: Item.berserkerShield,
        levelRequired: 2,
        cost: {
            resources: { wood: 20, iron: 5 },
            time: time.HALF_HOUR,
        },
    },
    [Item.brassKnuckles]: {
        item: Item.brassKnuckles,
        cost: {
            resources: { wood: 20, iron: 5 },
            time: time.HALF_HOUR,
        },
    },
    [Item.simpleCrossbow]: {
        item: Item.simpleCrossbow,
        cost: {
            resources: { wood: 20, iron: 5 },
            time: time.HALF_HOUR,
        },
    },
    [Item.cleaver]: {
        item: Item.cleaver,
        cost: {
            resources: { wood: 10, iron: 15 },
            time: time.HALF_HOUR,
        },
    },
    [Item.club]: {
        item: Item.club,
        cost: {
            resources: { wood: 30,},
            time: time.HALF_HOUR,
        },
    },
    [Item.dagger]: {
        item: Item.dagger,
        cost: {
            resources: { wood: 10, iron: 10},
            time: time.ONE_HOUR,
        },
    },
    [Item.flail]: {
        item: Item.flail,
        cost: {
            resources: { wood: 10, iron: 10},
            time: time.ONE_HOUR,
        },
    },
    [Item.goldenShield]: {
        item: Item.goldenShield,
        levelRequired: 2,
        cost: {
            resources: { wood: 20, iron: 5 },
            time: time.HALF_HOUR,
        },
    },
    [Item.javelin]: {
        item: Item.javelin,
        cost: {
            resources: { wood: 20, iron: 10},
            time: time.ONE_HOUR + time.HALF_HOUR,
        },
    },
    [Item.khopesh]: {
        item: Item.khopesh,
        cost: {
            resources: { wood: 15, iron: 40},
            time:  time.TWO_MINUTES,
        },
    },
    [Item.longbow]: {
        item: Item.longbow,
        cost: {
            resources: { wood: 40, iron: 5},
            time: time.ONE_HOUR,
        },
    },
    [Item.mace]: {
        item: Item.mace,
        cost: {
            resources: { wood: 15, iron: 10},
            time: time.ONE_HOUR,
        },
    },
    [Item.morningStar]: {
        item: Item.morningStar,
        cost: {
            resources: { wood: 15, iron: 15},
            time: time.ONE_HOUR,
        },
    },
    [Item.paintedBuckler]: {
        item: Item.paintedBuckler,
        cost: {
            resources: { wood: 20, iron: 10},
            time: time.ONE_HOUR + time.HALF_HOUR,
        },
    },
    [Item.poisonedDagger]: {
        item: Item.poisonedDagger,
        cost: {
            resources: { wood: 50, iron: 15},
            materials: [ Item.poisonVial ],
            time: time.ONE_HOUR,
        },
    },
    [Item.ravenStaff]: {
        item: Item.ravenStaff,
        cost: {
            resources: { wood: 15, iron: 10, food: 5},
            time: time.ONE_HOUR,
        },
    },
    [Item.savageStaff]: {
        item: Item.savageStaff,
        cost: {
            resources: { wood: 15, iron: 10, food: 5},
            time: time.ONE_HOUR,
        },
    },
    [Item.spear]: {
        item: Item.spear,
        cost: {
            resources: { wood: 15, iron: 15},
            time: time.ONE_HOUR,
        },
    },
    [Item.steelShield]: {
        item: Item.steelShield,
        cost: {
            resources: { wood: 15, iron: 15},
            time: time.ONE_HOUR,
        },
    },
    [Item.sword]: {
        item: Item.sword,
        cost: {
            resources: { wood: 10, iron: 30},
            time:  time.ONE_HOUR,
        },
    },
    [Item.warhammer]: {
        item: Item.warhammer,
        cost: {
            resources: { wood: 10, iron: 30},
            time:  time.ONE_HOUR,
        },
    },
    [Item.woodenBulwark]: {
        item: Item.woodenBulwark,
        cost: {
            resources: { wood: 10, iron: 30},
            time:  time.ONE_HOUR,
        },
    },
};
export default weaponsmithProduction;

export function getDefinition(item: Item) {
    return weaponsmithProduction[item];
}

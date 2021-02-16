
import { Weapon } from "definitions/items/weapons";
import * as time from "utils/format/time";
import { ProductionDefinition } from "./types";

const weaponsmithProduction: {[key in Weapon]?: ProductionDefinition} = {
    "weapon/aegisOfValor": {
        item: "weapon/aegisOfValor",
        levelRequired: 3,
        cost: {
            resources: { wood: 20, iron: 5 },
            time: time.HALF_HOUR,
        },
    },
    "weapon/arbalest": {
        item: "weapon/arbalest",
        cost: {
            resources: { wood: 20, iron: 5 },
            time: time.HALF_HOUR,
        },
    },
    "weapon/battleAxe": {
        item: "weapon/battleAxe",
        cost: {
            resources: { wood: 20, iron: 5 },
            time: time.HALF_HOUR,
        },
    },
    "weapon/berserkerShield": {
        item: "weapon/berserkerShield",
        levelRequired: 2,
        cost: {
            resources: { wood: 20, iron: 5 },
            time: time.HALF_HOUR,
        },
    },
    "weapon/brassKnuckles": {
        item: "weapon/brassKnuckles",
        cost: {
            resources: { wood: 20, iron: 5 },
            time: time.HALF_HOUR,
        },
    },
    "weapon/simpleCrossbow": {
        item: "weapon/simpleCrossbow",
        cost: {
            resources: { wood: 20, iron: 5 },
            time: time.HALF_HOUR,
        },
    },
    "weapon/cleaver": {
        item: "weapon/cleaver",
        cost: {
            resources: { wood: 10, iron: 15 },
            time: time.HALF_HOUR,
        },
    },
    "weapon/club": {
        item: "weapon/club",
        cost: {
            resources: { wood: 30,},
            time: time.HALF_HOUR,
        },
    },
    "weapon/dagger": {
        item: "weapon/dagger",
        cost: {
            resources: { wood: 10, iron: 10},
            time: time.ONE_HOUR,
        },
    },
    "weapon/flail": {
        item: "weapon/flail",
        cost: {
            resources: { wood: 10, iron: 10},
            time: time.ONE_HOUR,
        },
    },
    "weapon/goldenShield": {
        item: "weapon/goldenShield",
        levelRequired: 2,
        cost: {
            resources: { wood: 20, iron: 5 },
            time: time.HALF_HOUR,
        },
    },
    "weapon/javelin": {
        item: "weapon/javelin",
        cost: {
            resources: { wood: 20, iron: 10},
            time: time.ONE_HOUR + time.HALF_HOUR,
        },
    },
    "weapon/khopesh": {
        item: "weapon/khopesh",
        cost: {
            resources: { wood: 15, iron: 40},
            time:  time.TWO_MINUTES,
        },
    },
    "weapon/longbow": {
        item: "weapon/longbow",
        cost: {
            resources: { wood: 40, iron: 5},
            time: time.ONE_HOUR,
        },
    },
    "weapon/mace": {
        item: "weapon/mace",
        cost: {
            resources: { wood: 15, iron: 10},
            time: time.ONE_HOUR,
        },
    },
    "weapon/morningStar": {
        item: "weapon/morningStar",
        cost: {
            resources: { wood: 15, iron: 15},
            time: time.ONE_HOUR,
        },
    },
    "weapon/paintedBuckler": {
        item: "weapon/paintedBuckler",
        cost: {
            resources: { wood: 20, iron: 10},
            time: time.ONE_HOUR + time.HALF_HOUR,
        },
    },
    "weapon/poisonedDagger": {
        item: "weapon/poisonedDagger",
        cost: {
            resources: { wood: 50, iron: 15},
            materials: [ "material/poisonVial" ],
            time: time.ONE_HOUR,
        },
    },
    "weapon/ravenStaff": {
        item: "weapon/ravenStaff",
        cost: {
            resources: { wood: 15, iron: 10, food: 5},
            time: time.ONE_HOUR,
        },
    },
    "weapon/savageStaff": {
        item: "weapon/savageStaff",
        cost: {
            resources: { wood: 15, iron: 10, food: 5},
            time: time.ONE_HOUR,
        },
    },
    "weapon/spear": {
        item: "weapon/spear",
        cost: {
            resources: { wood: 15, iron: 15},
            time: time.ONE_HOUR,
        },
    },
    "weapon/steelShield": {
        item: "weapon/steelShield",
        cost: {
            resources: { wood: 15, iron: 15},
            time: time.ONE_HOUR,
        },
    },
    "weapon/steelSword": {
        item: "weapon/steelSword",
        cost: {
            resources: { wood: 10, iron: 30},
            time:  time.ONE_HOUR,
        },
    },
    "weapon/warhammer": {
        item: "weapon/warhammer",
        cost: {
            resources: { wood: 10, iron: 30},
            time:  time.ONE_HOUR,
        },
    },
    "weapon/woodenBulwark": {
        item: "weapon/woodenBulwark",
        cost: {
            resources: { wood: 10, iron: 30},
            time:  time.ONE_HOUR,
        },
    },
};
export default weaponsmithProduction;

export function getDefinition(item: Weapon) {
    return weaponsmithProduction[item];
}

import { Item, ItemDefinition, ItemType } from "./types";

type Prefix = "questItem/";
const PREFIX = "questItem/";
const itemType = ItemType.questItem;
const basePath = "/img/items/quest-items/";


const questItems = {
    blueprints: {
        itemType,
        iconImg: `${basePath}blueprints.png`,
    },
    crate: {
        itemType,
        iconImg: `${basePath}crate.png`,
    },
    dynamite: {
        itemType,
        iconImg: `${basePath}dynamite.png`,
    },
    dragonEye: {
        itemType,
        iconImg: `${basePath}dragon-eye.png`,
    },
    eye: {
        itemType,
        iconImg: `${basePath}eye.png`,
    },
    feather: {
        itemType,
        iconImg: `${basePath}feather.png`,
    },
    food: {
        itemType,
        iconImg: `${basePath}food.png`,
    },
    heart: {
        itemType,
        iconImg: `${basePath}heart.png`,
    },
    horn: {
        itemType,
        iconImg: `${basePath}horn.png`,
    },
    key: {
        itemType,
        iconImg: `${basePath}key.png`,
    },
    letters: {
        itemType,
        iconImg: `${basePath}letters.png`,
    },
    lockPicks: {
        itemType,
        iconImg: `${basePath}lock-picks.png`,
    },
    oil: {
        itemType,
        iconImg: `${basePath}oil.png`,
    },
    orcFinger: {
        itemType,
        iconImg: `${basePath}orc-finger.png`,
    },
    plans: {
        itemType,
        iconImg: `${basePath}plans.png`,
    },
    purpleGems: {
        itemType,
        iconImg: `${basePath}purple-gems.png`,
    },
    runestone: {
        itemType,
        iconImg: `${basePath}runestone.png`,
    },
    sandwich: {
        itemType,
        iconImg: `${basePath}sandwich.png`,
    },
    teeth: {
        itemType,
        iconImg: `${basePath}teeth.png`,
    },
    tooth: {
        itemType,
        iconImg: `${basePath}tooth.png`,
    },
    torch: {
        itemType,
        iconImg: `${basePath}torch.png`,
    },
    tusk: {
        itemType,
        iconImg: `${basePath}tusk.png`,
    },
    vase: {
        itemType,
        iconImg: `${basePath}vase.png`,
    },
    vial: {
        itemType,
        iconImg: `${basePath}vial.png`,
    },
    weeds: {
        itemType,
        iconImg: `${basePath}weeds.png`,
    },
};


export type QuestItem = `${Prefix}${keyof typeof questItems}`;
const all = Object.entries(questItems).reduce<{[key: string]: ItemDefinition}>((acc, [key, value]) => {
    acc[`${PREFIX}${key}`] = value;
    return acc;    
}, {}) as Record<QuestItem, ItemDefinition>;
export default all;

export function getDefinition(questItem: QuestItem): ItemDefinition {
    return all[questItem];
}

export const isQuestItem = (item: Item): item is QuestItem => {
    return !!all[item as QuestItem];
}

import { ItemType, ItemDefinition, ItemCategory } from './types';

type Prefix = 'questItem/';
const PREFIX = 'questItem/';
const itemCategory = ItemCategory.questItem;
const basePath = '/img/items/quest-items/';


const questItems = {
  blueprints: {
    itemCategory,
    iconImg: `${basePath}blueprints.png`,
  },
  crate: {
    itemCategory,
    iconImg: `${basePath}crate.png`,
  },
  dynamite: {
    itemCategory,
    iconImg: `${basePath}dynamite.png`,
  },
  dragonEye: {
    itemCategory,
    iconImg: `${basePath}dragon-eye.png`,
  },
  eye: {
    itemCategory,
    iconImg: `${basePath}eye.png`,
  },
  feather: {
    itemCategory,
    iconImg: `${basePath}feather.png`,
  },
  food: {
    itemCategory,
    iconImg: `${basePath}food.png`,
  },
  heart: {
    itemCategory,
    iconImg: `${basePath}heart.png`,
  },
  horn: {
    itemCategory,
    iconImg: `${basePath}horn.png`,
  },
  key: {
    itemCategory,
    iconImg: `${basePath}key.png`,
  },
  letters: {
    itemCategory,
    iconImg: `${basePath}letters.png`,
  },
  lockPicks: {
    itemCategory,
    iconImg: `${basePath}lock-picks.png`,
  },
  oil: {
    itemCategory,
    iconImg: `${basePath}oil.png`,
  },
  orcFinger: {
    itemCategory,
    iconImg: `${basePath}orc-finger.png`,
  },
  plans: {
    itemCategory,
    iconImg: `${basePath}plans.png`,
  },
  purpleGems: {
    itemCategory,
    iconImg: `${basePath}purple-gems.png`,
  },
  runestone: {
    itemCategory,
    iconImg: `${basePath}runestone.png`,
  },
  sandwich: {
    itemCategory,
    iconImg: `${basePath}sandwich.png`,
  },
  teeth: {
    itemCategory,
    iconImg: `${basePath}teeth.png`,
  },
  tooth: {
    itemCategory,
    iconImg: `${basePath}tooth.png`,
  },
  torch: {
    itemCategory,
    iconImg: `${basePath}torch.png`,
  },
  tusk: {
    itemCategory,
    iconImg: `${basePath}tusk.png`,
  },
  vase: {
    itemCategory,
    iconImg: `${basePath}vase.png`,
  },
  vial: {
    itemCategory,
    iconImg: `${basePath}vial.png`,
  },
  weeds: {
    itemCategory,
    iconImg: `${basePath}weeds.png`,
  },
};


export type QuestItem = `${Prefix}${keyof typeof questItems}`;
const all = Object.entries(questItems).reduce<{ [key: string]: ItemDefinition }>((acc, [key, value]) => {
  acc[`${PREFIX}${key}`] = value;
  return acc;
}, {}) as Record<QuestItem, ItemDefinition>;
export default all;

export function getDefinition(questItem: QuestItem): ItemDefinition {
  return all[questItem];
}

export const isQuestItem = (item: ItemType): item is QuestItem => {
  return !!all[item as QuestItem];
};

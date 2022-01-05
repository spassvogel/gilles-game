import { ItemType, ItemDefinition, ItemCategory } from './types';

type Prefix = 'material/';
const PREFIX = 'material/';
const itemCategory = ItemCategory.material;
const basePath = '/img/items/materials/';


const materials = {
  arrowheads: {
    itemCategory,
    iconImg: `${basePath}arrowheads.png`,
  },
  beam: {
    itemCategory,
    iconImg: `${basePath}beam.png`,
  },
  bolts: {
    itemCategory,
    iconImg: `${basePath}bolts.png`,
  },
  buckle: {
    itemCategory,
    iconImg: `${basePath}buckle.png`,
  },
  chain: {
    itemCategory,
    iconImg: `${basePath}chain.png`,
  },
  cogs: {
    itemCategory,
    iconImg: `${basePath}cogs.png`,
  },
  gunpowder: {
    itemCategory,
    iconImg: `${basePath}gunpowder.png`,
  },
  ingot: {
    itemCategory,
    iconImg: `${basePath}ingot.png`,
  },
  nails: {
    itemCategory,
    iconImg: `${basePath}nails.png`,
  },
  pile: {
    itemCategory,
    iconImg: `${basePath}pile.png`,
  },
  planks: {
    itemCategory,
    iconImg: `${basePath}planks.png`,
  },
  poisonVial: {
    itemCategory,
    iconImg: `${basePath}poison-vial.png`,
  },
  pulley: {
    itemCategory,
    iconImg: `${basePath}pulley.png`,
  },
  ribbon: {
    itemCategory,
    iconImg: `${basePath}ribbon.png`,
  },
  rope: {
    itemCategory,
    iconImg: `${basePath}rope.png`,
  },
  runeCarvedPlank: {
    itemCategory,
    iconImg: `${basePath}rune-carved-plank.png`,
  },
  scales: {
    itemCategory,
    iconImg: `${basePath}scales.png`,
  },
  spring: {
    itemCategory,
    iconImg: `${basePath}spring.png`,
  },
  stake: {
    itemCategory,
    iconImg: `${basePath}stake.png`,
  },
  stick: {
    itemCategory,
    iconImg: `${basePath}stick.png`,
  },
  thread: {
    itemCategory,
    iconImg: `${basePath}thread.png`,
  },
  woodenMask: {
    itemCategory,
    iconImg: `${basePath}wooden-mask.png`,
  },
};


export type Material = `${Prefix}${keyof typeof materials}`;
const all = Object.entries(materials).reduce<{ [key: string]: ItemDefinition }>((acc, [key, value]) => {
  acc[`${PREFIX}${key}`] = value;
  return acc;
}, {}) as Record<Material, ItemDefinition>;
export default all;

export function getDefinition(material: Material): ItemDefinition {
  return all[material];
}

export const isMaterial = (item: ItemType): item is Material => {
  return !!all[item as Material];
};

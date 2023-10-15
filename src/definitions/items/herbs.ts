import { type ItemType, type ItemDefinition, ItemCategory } from './types'

type Prefix = 'herb/'
const PREFIX = 'herb/'
const itemCategory = ItemCategory.herb
const basePath = '/img/items/herbs/'

const herbs = {
  angelicasSorrow: {
    itemCategory,
    iconImg: `${basePath}angelicas-sorrow.png`
  },
  bansheeReeds: {
    itemCategory,
    iconImg: `${basePath}banshee-reeds.png`
  },
  blissflower: {
    itemCategory,
    iconImg: `${basePath}blissflower.png`
  },
  bloodLotus: {
    itemCategory,
    iconImg: `${basePath}blood-lotus.png`
  },
  bogroot: {
    itemCategory,
    iconImg: `${basePath}bogroot.png`
  },
  ceviorise: {
    itemCategory,
    iconImg: `${basePath}ceviorise.png`
  },
  chicory: {
    itemCategory,
    iconImg: `${basePath}chicory.png`
  },
  dragonroot: {
    itemCategory,
    iconImg: `${basePath}dragonroot.png`
  },
  heartsVine: {
    itemCategory,
    iconImg: `${basePath}hearts-vine.png`
  },
  hyacinthus: {
    itemCategory,
    iconImg: `${basePath}hyacinthus.png`
  },
  jaboticaba: {
    itemCategory,
    iconImg: `${basePath}jaboticaba.png`
  },
  kingsrose: {
    itemCategory,
    iconImg: `${basePath}kingsrose.png`
  },
  lastSupper: {
    itemCategory,
    iconImg: `${basePath}last-supper.png`
  },
  mistagold: {
    itemCategory,
    iconImg: `${basePath}mistagold.png`
  },
  monksweed: {
    itemCategory,
    iconImg: `${basePath}monksweed.png`
  },
  moonFlower: {
    itemCategory,
    iconImg: `${basePath}moon-flower.png`
  },
  mountainGrass: {
    itemCategory,
    iconImg: `${basePath}mountain-grass.png`
  },
  oakLeaf: {
    itemCategory,
    iconImg: `${basePath}oak-leaf.png`
  },
  patricksroot: {
    itemCategory,
    iconImg: `${basePath}patricksroot.png`
  },
  sunleaf: {
    itemCategory,
    iconImg: `${basePath}sunleaf.png`
  },
  trollsFeast: {
    itemCategory,
    iconImg: `${basePath}trolls-feast.png`
  },
  uwolic: {
    itemCategory,
    iconImg: `${basePath}uwolic.png`
  },
  wyrmvine: {
    itemCategory,
    iconImg: `${basePath}wyrmvine.png`
  },
  winterWeed: {
    itemCategory,
    iconImg: `${basePath}winter-weed.png`
  },
  wizardsBane: {
    itemCategory,
    iconImg: `${basePath}wizards-bane.png`
  }
}

export type Herb = `${Prefix}${keyof typeof herbs}`
const all = Object.entries(herbs).reduce<Record<string, ItemDefinition>>((acc, [key, value]) => {
  acc[`${PREFIX}${key}`] = value
  return acc
}, {}) as Record<Herb, ItemDefinition>
export default all

export function getDefinition (herb: Herb): ItemDefinition {
  return all[herb]
}

export const isHerb = (item: ItemType): item is Herb => {
  return all[item as Herb] !== undefined
}

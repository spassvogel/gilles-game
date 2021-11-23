import { Structure } from "../structures";
import { ItemType, ItemDefinition, ItemCategory } from "./types";

type Prefix = "deed/";
const PREFIX = "deed/";
const itemCategory = ItemCategory.deed;
const basePath = "/img/items/deeds/";

export interface DeedDefinition extends ItemDefinition {
  structure: Structure;
}

const deeds = {
  alchemist: {
    structure: "alchemist" as const,
    itemCategory,
    iconImg: `${basePath}deed.png`,
  },
  armoursmith: {
    structure: "armoursmith" as const,
    itemCategory,
    iconImg: `${basePath}deed.png`,
  },
  lumbermill: {
    structure: "lumberMill" as const,
    itemCategory,
    iconImg: `${basePath}deed.png`,
  },
  tavern: {
    structure: "tavern" as const,
    itemCategory,
    iconImg: `${basePath}deed.png`,
  },
  weaponsmith: {
    structure: "weaponsmith" as const,
    itemCategory,
    iconImg: `${basePath}deed.png`,
  },
  workshop: {
    structure: "workshop" as const,
    itemCategory,
    iconImg: `${basePath}deed.png`,
  }
}

export type Deed = `${Prefix}${keyof typeof deeds}`;
const all = Object.entries(deeds).reduce<{[key: string]: DeedDefinition}>((acc, [key, value]) => {
  acc[`${PREFIX}${key}`] = value;
  return acc;
}, {}) as Record<Deed, DeedDefinition>;
export default all;

export function getDefinition(deed: Deed): DeedDefinition {
  return all[deed] as unknown as DeedDefinition;
}

export const isDeed = (item: ItemType): item is Deed => {
  return !!all[item as Deed];
}

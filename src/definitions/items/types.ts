import { Rarity } from 'constants/items';
import { Apparel } from './apparel';
import { Deed } from './deeds';
import { Herb } from './herbs';
import { Material } from './materials';
import { Potion } from './potions';
import { QuestItem } from './questItems';
import { Trinket } from './trinkets';
import { Weapon } from './weapons';

export enum ItemType {
    apparel,
    deed,
    herb,
    material,
    potion,
    questItem,
    trinket,
    weapon,
}

export type Item = Apparel | Deed | Herb | Material | Potion | QuestItem | Trinket | Weapon;

export interface ItemDefinition {
    itemType: ItemType;
    iconImg: string;
    rarity?: Rarity;
//    articleUndefined?: string;  // Key to text
    unique?: boolean;           // Indicate that this item is unique.
                                // Not actually enforced by anything,
                                // but used to generate the article ('a' or 'the')
}

import { ItemDefinition } from 'definitions/items/types';

export enum Rarity {
    // gray = common, green = uncommon, blue = rare, purple = epic, orange = legendary
    common,
    uncommon,
    rare,
    epic,
    legendary
}

export const getIconClassName = (rarity?: Rarity): string => {
    switch (rarity) {
        case Rarity.common:
            return "item-icon-common";
        case Rarity.uncommon:
            return "item-icon-uncommon";
        case Rarity.rare:
            return "item-icon-rare";
        case Rarity.epic:
            return "item-icon-epic";
        case Rarity.legendary:
            return "item-icon-legendary";
    }
    return getIconClassName(Rarity.common);
};

export const getItemNameClassName = (item: ItemDefinition): string => {
    const {rarity} = item;
    switch (rarity) {
        case Rarity.common:
            return "item-name-common";
        case Rarity.uncommon:
            return "item-name-uncommon";
        case Rarity.rare:
            return "item-name-rare";
        case Rarity.epic:
            return "item-name-epic";
        case Rarity.legendary:
            return "item-name-legendary";
    }
    return getIconClassName(Rarity.common);
};

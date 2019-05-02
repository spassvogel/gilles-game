
export enum ItemType {
    equipment,
    deed,
}

// the string must correspond to a named export in /items/index.tsx
export enum Item {
    crossbow = "crossbow",
    longbow = "longbow",
    dagger = "dagger",
    ironSword = "ironSword",
    magicAmulet = "magicAmulet",
    deedForLumbermill = "deedForLumbermill",
    deedForWeaponsmith = "deedForWeaponsmith",
    greatswordOfGwai = "greatswordOfGwai",
    sword = "sword",
    jewel = "jewel",
    khopesh = "khopesh",
    torch = "torch",
}

export interface ItemDefinition {
    item: Item;
    itemType: ItemType;
    subText?: string;           // todo: deprecate, store subtext in language file. use name to retrieve
    name: string;
    iconImg: string;
//    articleUndefined?: string;  // Key to text
    unique?: boolean;           // Indicate that this item is unique.
                                // Not actually enforced by anything,
                                // but used to generate the article ('a' or 'the')
}

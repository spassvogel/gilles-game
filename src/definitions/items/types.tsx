
export enum ItemType {
    equipment,
    deed,
    material,
    trinket,
}

// the string must correspond to a named export in /items/index.tsx
export enum Item {
    // deeds
    magicAmulet = "magicAmulet",

    // materials
    bolts = "bolts",
    buckle = "buckle",
    cogs = "cogs",
    gem = "gem",
    ingot = "ingot",
    nails = "nails",
    poisonVial = "poisonVial",
    ribbon = "ribbon",
    scales = "scales",
    spring = "spring",
    thread = "thread",

    // trinkets
    ring = "ring",
    deedForLumbermill = "deedForLumbermill",
    deedForWeaponsmith = "deedForWeaponsmith",

    // weapons
    battleAxe = "battleAxe",
    brassKnuckles = "brassKnuckles",
    cleaver = "cleaver",
    club = "club",
    crossbow = "crossbow",
    dagger = "dagger",
    flail = "flail",
    greatswordOfGwai = "greatswordOfGwai",
    khopesh = "khopesh",
    longbow = "longbow",
    mace = "mace",
    morningStar = "morningStar",
    poisonedDagger = "poisonedDagger",
    spear = "spear",
    sword = "sword",

    torch = "torch",

}

export interface ItemDefinition {
    item: Item;
    itemType: ItemType;
    subText?: string;           // todo: deprecate, store subtext in language file. use name to retrieve
    iconImg: string;
//    articleUndefined?: string;  // Key to text
    unique?: boolean;           // Indicate that this item is unique.
                                // Not actually enforced by anything,
                                // but used to generate the article ('a' or 'the')
}

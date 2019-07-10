
export enum ItemType {
    deed,
    material,
    questItem,
    trinket,
    weapon,
}

// the string must correspond to a named export in /items/index.tsx
export enum Item {
    // deeds
    deedForLumbermill = "deedForLumbermill",
    deedForWeaponsmith = "deedForWeaponsmith",

    // materials
    bolts = "bolts",
    buckle = "buckle",
    chain = "chain",
    cogs = "cogs",
    gem = "gem",
    ingot = "ingot",
    nails = "nails",
    poisonVial = "poisonVial",
    ribbon = "ribbon",
    rope = "rope",
    scales = "scales",
    spring = "spring",
    thread = "thread",

    // quest-items
    crate = "crate",
    key = "key",
    lockPicks = "lockPicks",
    purpleGems = "purpleGems",
    tooth = "tooth",
    torch = "torch",
    tusk = "tusk",
    vial = "vial",
    weeds = "weeds",

    // trinkets
    ring = "ring",
    magicAmulet = "magicAmulet",

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
    ravenStaff = "ravenStaff",
    savageStaff = "savageStaff",
    spear = "spear",
    sword = "sword",
    warhammer = "warhammer",
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

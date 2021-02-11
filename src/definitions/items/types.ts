import { Rarity } from 'constants/items';

export enum ItemType {
    deed,
    apparel,
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

    // equipment
    boots1 = "boots1",
    boots2 = "boots2",
    boots3 = "boots3",
    chainmailHood = "chainmailHood",
    chest = "chest",
    clothGloves = "clothGloves",
    cowl = "cowl",
    fedora = "fedora",
    druidChest = "druidChest",
    druidFeet = "druidFeet",
    druidHands = "druidHands",
    druidHead = "druidHead",
    druidLegs = "druidLegs",
    greaves1 = "greaves1",
    greaves2 = "greaves2",
    hornedHelmet = "hornedHelmet",
    leatherGloves = "leatherGloves",
    nomadHelmet = "nomadHelmet",
    pants1 = "pants1",
    pants2 = "pants2",
    plateChest1 = "plateChest1",
    plateChest2 = "plateChest2",
    plateChest3 = "plateChest3",
    plateChest4 = "plateChest4",
    plateGloves1 = "plateGloves1",
    plateGloves2 = "plateGloves2",
    plateHelmet = "plateHelmet",
    platePants = "platePants",
    plateShoulders1 = "plateShoulders1",
    plateShoulders2 = "plateShoulders2",
    robe = "robe",
    shoulders1 = "shoulders1",
    shoulders2 = "shoulders2",
    shoulders3 = "shoulders3",
    vest = "vest",

    // materials
    arrowheads = "arrowheads",
    bolts = "bolts",
    buckle = "buckle",
    chain = "chain",
    cogs = "cogs",
    gem = "gem",
    gunpowder = "gunpowder",
    ingot = "ingot",
    nails = "nails",
    poisonVial = "poisonVial",
    ribbon = "ribbon",
    rope = "rope",
    scales = "scales",
    spring = "spring",
    thread = "thread",

    // quest-items
    blueprints = "blueprints",
    crate = "crate",
    dragonEye = "dragonEye",
    dynamite = "dynamite",
    eye = "eye",
    feather = "feather",
    food = "food",
    heart = "heart",
    horn = "horn",
    key = "key",
    letters = "letters",
    lockPicks = "lockPicks",
    oil = "oil",
    orcFinger = "orcFinger",
    plans = "plans",
    purpleGems = "purpleGems",
    runestone = "runestone",
    sandwich = "sandwich",
    teeth = "teeth",
    tooth = "tooth",
    torch = "torch",
    tusk = "tusk",
    vase = "vase",
    vial = "vial",
    weeds = "weeds",

    // trinkets
    ring = "ring",
    magicAmulet = "magicAmulet",

    // weapons
    aegisOfValor = "aegisOfValor",
    arbalest = "arbalest",
    battleAxe = "battleAxe",
    berserkerShield = "berserkerShield",
    brassKnuckles = "brassKnuckles",
    bronzeDagger = "bronzeDagger",
    buckler = "buckler",
    cleaver = "cleaver",
    club = "club",
    dagger = "dagger",
    dirk = "dirk",
    falchion = "falchion",
    flail = "flail",
    goldenShield = "goldenShield",
    greatswordOfGwai = "greatswordOfGwai",
    halbert = "halbert",
    huntingBow = "huntingBow",
    indomitableCarapace = "indomitableCarapace",
    javelin = "javelin",
    khopesh = "khopesh",
    legionnaireSword = "legionnaireSword",
    longbow = "longbow",
    mace = "mace",
    morningStar = "morningStar",
    paintedBuckler = "paintedBuckler",
    poisonedDagger = "poisonedDagger",
    pikeStaff = "pikeStaff",
    ravenStaff = "ravenStaff",
    scythe = "scythe",
    savageStaff = "savageStaff",
    simpleCrossbow = "simpleCrossbow",
    spear = "spear",
    steelShield = "steelShield",
    steelSword = "steelSword",
    warhammer = "warhammer",
    woodenBulwark = "woodenBulwark"
}


export interface ItemDefinition {
    item: Item;
    itemType: ItemType;
    iconImg: string;
    rarity?: Rarity;
//    articleUndefined?: string;  // Key to text
    unique?: boolean;           // Indicate that this item is unique.
                                // Not actually enforced by anything,
                                // but used to generate the article ('a' or 'the')
}

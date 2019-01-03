
export enum ItemType {
    equipment,
    deed,
}

export enum Item {
    crossbow = "crossbow",
    longbow = "longbow",
    dagger = "dagger",
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
    subText: string;
    name: string;
    iconImg: string;
}

import ItemIcon from "src/components/partyScreen/ItemIcon";

export enum Item {
    crossbow = "crossbow",
    longbow = "longbow",
    dagger = "dagger",
    deedForLumbermill = "deedForLumbermill",
    sword = "sword",
    jewel = "jewel",
    khopesh = "khopesh",
    torch = "torch",
}

export interface ItemDefinition {
    item: Item;
    subText: string;
    name: string;
    iconImg: string;
}

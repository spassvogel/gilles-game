export enum Equipment {
    crossbow = "crossbow",
    longbow = "longbow",
    dagger = "dagger",
    sword = "sword",
    khopesh = "khopesh",
    torch = "torch",
}

export enum QuestItems {
    jewel = "jewel",
}

export type Item = Equipment | QuestItems;

export interface EquipmentDefinition {
    equipment: Equipment;
    subText: string;
    name: string;
    iconImg: string;
}

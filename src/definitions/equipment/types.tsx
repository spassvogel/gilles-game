export enum Equipment {
    crossbow = "crossbow",
    longbow = "longbow",
    dagger = "dagger",
    sword = "sword",
    khopesh = "khopesh",
    torch = "torch",
}

export interface EquipmentDefinition {
    equipment: Equipment;
    name: string;
    iconImg: string;
}

import { ItemDefinition } from "src/definitions/items/types";

// Things that can be dragged
export const DragType = {
    ADVENTURER: "adventurer",   // Adventurer avatar
    ITEM: "item",               // A game 'item' (equipment, etc)
};

// Source, where it comes from
export enum DragSourceType {
    adventurer,
    warehouse,
    tavern,
}

// Things that can be shown on the ContextView
export enum ContextType {
    item,
}

export type ContextInfo = ItemDefinition;

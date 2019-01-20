import { ItemDefinition } from "src/definitions/items/types";

// Things that can be dragged
export const DragType = {
    ITEM: "item",               // A game 'item' (equipment..?)
};

export enum DragSourceType {
    adventurer,
    warehouse,
}

// Things that can be shown on the ContextView
export enum ContextType {
    item,
}

export type ContextInfo = ItemDefinition;

import { EquipmentDefinition } from "src/definitions/equipment/types";

// Things that can be dragged
export const DragType = {
    ITEM: "item",   // A game 'item' (equipment..?)
};

// Things that can be shown on the ContextView
export enum ContextType {
    item,
}

export type ContextInfo = EquipmentDefinition;

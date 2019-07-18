import { ItemDefinition } from "definitions/items/types";

// Things that can be shown on the ContextView
export enum ContextType {
    item,
}

export type ContextInfo = ItemDefinition;

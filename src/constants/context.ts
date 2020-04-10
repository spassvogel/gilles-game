import { ItemDefinition } from "definitions/items/types";

// Things that can be shown on the ContextPopup
export enum ContextType {
    item,
}

export type ContextInfo = ItemDefinition;

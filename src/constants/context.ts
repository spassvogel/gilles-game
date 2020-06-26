import { ItemDefinition } from "definitions/items/types";

// Things that can be shown on the ContextPopup
export enum ContextType {
    item,
    resource
}

export type ContextInfo = ItemDefinition | string;

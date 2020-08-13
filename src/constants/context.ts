import { ItemDefinition } from "definitions/items/types";
import { TraitDefinition } from 'definitions/traits/types';

// Things that can be shown on the ContextPopup
export enum ContextType {
    item,
    trait,
    resource
}

export type ContextInfo = ItemDefinition | TraitDefinition | string;

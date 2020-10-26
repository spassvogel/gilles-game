import { ReactNode } from 'react';
import { ItemDefinition } from "definitions/items/types";
import { WeaponType } from 'definitions/items/weapons';
import { TraitDefinition } from 'definitions/traits/types';

// Things that can be shown on the ContextPopup
export enum ContextType {
    item,
    trait,
    resource,
    skill,
    component
}

export type ContextInfo = ItemDefinition | TraitDefinition | WeaponType | string | ReactNode;

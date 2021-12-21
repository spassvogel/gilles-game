import { ReactNode } from 'react';
import { ItemType } from "definitions/items/types";
import { WeaponType } from 'definitions/items/weapons';
import { TraitDefinition } from 'definitions/traits/types';
import { ActorObject } from 'store/types/scene';
import { Effect } from 'definitions/effects/types';
import { ExtendedAttribute } from 'mechanics/adventurers/attributes';

// Things that can be shown on the ContextPopup
export enum ContextType {
  actor,
  attribute,
  effect,
  item,
  trait,
  resource,
  skill,
  component
}

export type ContextInfo = ItemType | TraitDefinition | WeaponType | string | ReactNode | ExtendedAttribute | ActorObject | Effect;

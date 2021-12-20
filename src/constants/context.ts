import { ReactNode } from 'react';
import { ItemType } from "definitions/items/types";
import { WeaponType } from 'definitions/items/weapons';
import { TraitDefinition } from 'definitions/traits/types';
import { BasicAttribute } from 'store/types/adventurer';
import { ActorObject } from 'store/types/scene';
import { Effect } from 'definitions/effects/types';

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

export type ContextInfo = ItemType | TraitDefinition | WeaponType | string | ReactNode | BasicAttribute | ActorObject | Effect;

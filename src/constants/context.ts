import { ReactNode } from 'react';
import { Item } from "definitions/items/types";
import { WeaponType } from 'definitions/items/weapons';
import { TraitDefinition } from 'definitions/traits/types';
import { BasicAttribute } from 'store/types/adventurer';
import { ActorObject } from 'store/types/scene';

// Things that can be shown on the ContextPopup
export enum ContextType {
  actor,
  attribute,
  item,
  trait,
  resource,
  skill,
  component
}

export type ContextInfo = Item | TraitDefinition | WeaponType | string | ReactNode | BasicAttribute | ActorObject;

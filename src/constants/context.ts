import { ReactNode } from 'react';
import { ItemType } from 'definitions/items/types';
import { TraitDefinition } from 'definitions/traits/types';
import { ActorObject } from 'store/types/scene';
import { Effect } from 'definitions/effects/types';
import { ExtendedAttribute } from 'mechanics/adventurers/attributes';
import { WeaponType } from 'mechanics/weapons';

// Things that can be shown on the ContextPopup
export enum ContextType {
  actor,
  attribute,
  component,
  item,
  resource,
  skill,
  tempEffect,
  trait,
}

export type ContextInfo = ItemType | TraitDefinition | WeaponType | string | ReactNode | ExtendedAttribute | ActorObject | Effect;

import { type ReactNode } from 'react'
import { type Item } from 'definitions/items/types'
import { type TraitDefinition } from 'definitions/traits/types'
import { type ActorObject } from 'store/types/scene'
import { type Effect } from 'definitions/effects/types'
import { type ExtendedAttribute } from 'mechanics/adventurers/attributes'
import { type WeaponType } from 'definitions/weaponTypes/types'
import { type TempEffect } from 'definitions/tempEffects/types'

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

export type ContextInfo = Item | TraitDefinition | WeaponType | string | ReactNode | ExtendedAttribute | ActorObject | Effect | TempEffect

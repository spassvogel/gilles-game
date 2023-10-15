import { type EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot'
import { type Ammunition } from 'definitions/items/ammunition'
import { type Apparel } from 'definitions/items/apparel'
import { type Item } from 'definitions/items/types'
import { type Weapon } from 'definitions/items/weapons'
import { type Trait } from 'definitions/traits/types'
import { type TempEffect } from 'definitions/tempEffects/types'
import { type WeaponType } from 'definitions/weaponTypes/types'
import { type Race } from 'constants/race'

export type AdventurerStoreState = {
  id: string
  name?: string
  flavor?: boolean // Has lore text, language key: `adventurer-{id}-flavor
  avatarImg: string
  spritesheet: string // Path to JSON of spritesheet to use in scenes
  color?: AdventurerColor
  race: Race
  traits?: Trait[]
  health: number // When this reaches zero, the adventurer is dead
  xp: number

  equipment: EquipmentStoreState // equipment
  tempEffects: TempEffect[] // combat effects
  inventory: Array<null | Item>
  basicAttributes: AttributesStoreState
  skills: SkillsStoreState //
  room: number // Adventurer is lodged in this room in the tavern
}

export enum AdventurerColor {
  blue,
  red,
  teal,
  purple,
  orange,
  black,
  white,
  yellow,
}

export type Equipment = Apparel | Weapon | Ammunition

export type EquipmentStoreState = {
  [EquipmentSlotType.head]?: Item<Apparel>
  [EquipmentSlotType.shoulders]?: Item<Apparel>
  [EquipmentSlotType.chest]?: Item<Apparel>
  [EquipmentSlotType.hands]?: Item<Apparel>
  [EquipmentSlotType.legs]?: Item<Apparel>
  [EquipmentSlotType.feet]?: Item<Apparel>
  [EquipmentSlotType.mainHand]?: Item<Weapon>
  [EquipmentSlotType.offHand]?: Item<Weapon> | Item<Ammunition>
}

export type AttributesStoreState = {
  str: number
  for: number
  int: number
  agi: number
}

// Determines the order in which the attributes are shown
export const attributeList: Attribute[] = ['str', 'for', 'int', 'agi']

export type Attribute = keyof AttributesStoreState

export type SkillsStoreState = {
  [key in WeaponType]?: number
}

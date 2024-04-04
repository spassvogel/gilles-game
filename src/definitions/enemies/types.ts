import { type EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot'
import { type Race } from 'constants/race'
import { type Ammunition } from 'definitions/items/ammunition'
import { type Item } from 'definitions/items/types'
import { type Weapon } from 'definitions/items/weapons'
import { ADVENTURER_PREFIX } from 'store/reducers/adventurers'
import { type AttributesStoreState, type SkillsStoreState } from 'store/types/adventurer'
import { type Troll } from './trolls'
import { type sprites } from 'bundles/sprites'

export type EnemyDefinition = {
  attributes: AttributesStoreState
  skills: SkillsStoreState
  mainHand: Item<Weapon>
  offHand?: Item<Weapon> | Item<Ammunition>
  armor: Partial<{ [key in EquipmentSlotType]: number }>
  spritesheet: keyof typeof sprites.actors
  avatarImg: string
  race: Race
}

export type EnemyType = Troll

// Given the id of an adventurer or enemyType, check if its an enemy or adventurer
export const checkIfEnemy = (name: string) => {
  return !name?.startsWith(ADVENTURER_PREFIX)
}

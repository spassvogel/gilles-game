import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot'
import { Race } from 'constants/race'
import { WeaponType } from 'definitions/weaponTypes/types'
import { type EnemyDefinition } from './types'
const avatarImgBasePath = '/img/avatars/monster/'

type TrollDefinition = Record<string, EnemyDefinition>

const trolls: TrollDefinition = {
  'troll-developer': {
    attributes: {
      str: 6,
      for: 5,
      int: 16,
      agi: 8
    },
    skills: {
      [WeaponType.sword]: 12
    },
    mainHand: { type: 'weapon/steelSword' },
    armor: {
      [EquipmentSlotType.feet]: 1,
      [EquipmentSlotType.hands]: 1,
      [EquipmentSlotType.chest]: 1,
      [EquipmentSlotType.legs]: 1,
      [EquipmentSlotType.head]: 1,
      [EquipmentSlotType.shoulders]: 1
    },
    spritesheet: 'SCENE_ACTOR_TROLL_SWORD',
    avatarImg: `${avatarImgBasePath}orc_01.png`,
    race: Race.troll
  },
  'troll-manager': {
    attributes: {
      str: 8,
      for: 7,
      int: 12,
      agi: 20
    },
    skills: {
      [WeaponType.axe]: 12
    },
    mainHand: { type: 'weapon/battleAxe' },
    armor: {

    },
    spritesheet: 'SCENE_ACTOR_TROLL_AXE',
    avatarImg: `${avatarImgBasePath}orc_02.png`,
    race: Race.troll
  },
  'troll-accountant': {
    attributes: {
      str: 8,
      for: 7,
      int: 12,
      agi: 10
    },
    skills: {
      [WeaponType.axe]: 12
    },
    mainHand: { type: 'weapon/battleAxe' },
    armor: {
      [EquipmentSlotType.feet]: 2,
      [EquipmentSlotType.hands]: 3,
      [EquipmentSlotType.chest]: 3,
      [EquipmentSlotType.legs]: 2,
      [EquipmentSlotType.head]: 2,
      [EquipmentSlotType.shoulders]: 2
    },
    spritesheet: 'SCENE_ACTOR_ORC_AXE',
    avatarImg: `${avatarImgBasePath}orc_03.png`,
    race: Race.troll
  }
}

export default trolls
export type Troll = `${keyof typeof trolls}`

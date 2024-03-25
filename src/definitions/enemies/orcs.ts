import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot'
import { Race } from 'constants/race'
import { WeaponType } from 'definitions/weaponTypes/types'
import { type EnemyDefinition } from './types'
const avatarImgBasePath = '/img/avatars/monster/'

type OrcDefinition = Record<string, EnemyDefinition>

const trolls: OrcDefinition = {
  'orc-accountant': {
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
    race: Race.orc
  }
}

export default trolls
export type Troll = `${keyof typeof trolls}`

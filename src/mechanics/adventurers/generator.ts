import { type AttributesStoreState, type AdventurerStoreState, AdventurerColor } from 'store/types/adventurer'
import { levelToXp } from './levels'
import { calculateBaseHitpoints } from './hitpoints'
import { generateRandomName } from 'global/LoreTextManager'
import { Race } from 'constants/race'
import { randomInt, randomItem } from 'utils/random'
import { WeaponType } from 'definitions/weaponTypes/types'
import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot'
import { createTempEffect } from 'definitions/tempEffects'
import { type TempEffectBrokenLegs, TempEffectType, type TempEffectBurning } from 'definitions/tempEffects/types'
import { Trait } from 'definitions/traits/types'
import { type sprites } from 'bundles/sprites'
import { Gender } from 'constants/gender'

export const ADVENTURER_PREFIX = 'adv_'

export const generateRandomAdventurer = (level = 1) => {
  const race = Race.human
  const gender = randomItem([Gender.male, Gender.female])
  const { health, basicAttributes, xp } = generateAttributesHealthAndXp(level)
  const avatarImg = generateAvatarImage(race, gender)
  const spritesheet = defineSpritesheet(race)
  const adventurer: AdventurerStoreState = {
    id: `${ADVENTURER_PREFIX}${Math.random().toString(36).substring(2)}`,
    name: generateRandomName(race, gender),
    avatarImg,
    spritesheet,
    flavor: false, // todo: generate flavor
    health,
    race,
    gender,
    basicAttributes,
    xp,
    traits: [],
    equipment: {},
    skills: {
      [WeaponType.crossbow]: 10,
      [WeaponType.bow]: 10
    },
    tempEffects: [],
    inventory: []
  }

  return adventurer
}

const generateRandomAttributes = (): AttributesStoreState => {
  return {
    str: Math.floor(Math.random() * 3) + 9,
    for: Math.floor(Math.random() * 3) + 9,
    int: Math.floor(Math.random() * 3) + 9,
    agi: Math.floor(Math.random() * 3) + 9
  }
}
const generateAttributesHealthAndXp = (level = 1) => {
  const basicAttributes = generateRandomAttributes()
  const xp = levelToXp(level) + (Math.random() * levelToXp(level + 1))
  const health = 20 + Math.random() * (calculateBaseHitpoints(level, basicAttributes.for) - 20)

  return {
    basicAttributes,
    xp,
    health
  }
}

// Create a bunch of guys for debugging
export const initialAdventurers: AdventurerStoreState[] = [{
  id: `${ADVENTURER_PREFIX}c4a5d270`,
  equipment: {
    [EquipmentSlotType.head]: { type: 'apparel/cowl', durability: 0.25 },
    [EquipmentSlotType.chest]: { type: 'apparel/chest', durability: 0.5 },
    [EquipmentSlotType.hands]: { type: 'apparel/clothGloves' },
    [EquipmentSlotType.shoulders]: { type: 'apparel/shoulders2' },
    [EquipmentSlotType.legs]: { type: 'apparel/pants2' },
    [EquipmentSlotType.feet]: { type: 'apparel/boots3' },
    [EquipmentSlotType.mainHand]: { type: 'weapon/longbow' },
    [EquipmentSlotType.offHand]: { type: 'ammunition/basicArrows', quantity: 200 }
    // offHand: Item.indomitableCarapace
  },
  ...generateAttributesHealthAndXp(),
  name: 'Sasha Falcon',
  // name: generateRandomName(Race.elf, true),
  flavor: true,
  traits: [Trait.houseMaddox, Trait.gloomy],
  avatarImg: 'human/female/f_14.png',
  spritesheet: 'ELF_BOW',
  color: AdventurerColor.purple,
  race: Race.elf,
  gender: Gender.female,
  skills: {
    [WeaponType.crossbow]: 10,
    [WeaponType.bow]: 10
  },
  tempEffects: [],
  inventory: [
    { type: 'deed/lumbermill' },
    null,
    { type: 'weapon/simpleCrossbow' },
    { type: 'weapon/dagger' },
    { type: 'weapon/khopesh' },
    null,
    { type: 'weapon/steelSword' },
    null,
    { type: 'consumable/lesserSoma' },
    { type: 'consumable/minorSoma' },
    { type: 'consumable/majorRagePotion' },
    { type: 'consumable/greaterManaPotion' },
    { type: 'consumable/majorHealthPotion' },
    null,
    { type: 'weapon/steelShield' },
    null,
    null,
    null,
    null
  ]
}, {
  id: `${ADVENTURER_PREFIX}2e655832`,
  equipment: {
    [EquipmentSlotType.feet]: { type: 'apparel/boots2' },
    [EquipmentSlotType.mainHand]: { type: 'weapon/simpleCrossbow' },
    [EquipmentSlotType.offHand]: { type: 'ammunition/crossbowBolts', quantity: 150 }
  },
  ...generateAttributesHealthAndXp(),
  name: 'Addison Chilson',
  // name: generateRandomName(Race.elf),
  flavor: true,

  avatarImg: 'human/female/f_16.png',
  spritesheet: 'ELF_BOW',
  color: AdventurerColor.teal,
  traits: [Trait.houseHouston],
  race: Race.human,
  gender: Gender.female,
  skills: {
    [WeaponType.crossbow]: 12,
    [WeaponType.staff]: 13
  },
  tempEffects: [],
  inventory: [
    { type: 'weapon/simpleCrossbow' },
    null,
    { type: 'consumable/greaterSoma' },
    null,
    null,
    null,
    { type: 'apparel/boots1' },
    { type: 'apparel/chainmailHood' },
    { type: 'apparel/nomadHelmet' },
    { type: 'apparel/plateChest4' },
    null,
    { type: 'weapon/buckler' },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    { type: 'consumable/minorRagePotion' },
    { type: 'apparel/plateHelmet' },
    { type: 'apparel/cowl' }]
}, {
  id: `${ADVENTURER_PREFIX}ec6f1050`,
  equipment: {
    [EquipmentSlotType.feet]: { type: 'apparel/boots3' },
    [EquipmentSlotType.mainHand]: { type: 'weapon/greatswordOfGwai' }
    // offHand: Item.aegisOfValor
  },
  ...generateAttributesHealthAndXp(),
  name: "Zackary 'bone bag' Morris",
  // name: generateRandomName(Race.undead),

  flavor: true,

  traits: [Trait.gloomy],
  race: Race.undead,
  gender: Gender.male,
  skills: {
    [WeaponType.sword]: 12,
    [WeaponType.hammer]: 6
  },
  avatarImg: 'undead/Undead_Male_Dark_Priest_bg.png',
  spritesheet: 'SKELETON',
  color: AdventurerColor.black,
  tempEffects: [
    createTempEffect<TempEffectBrokenLegs>({
      type: TempEffectType.brokenLegs,
      damage: 10,
      charges: 10
    }),
    createTempEffect<TempEffectBurning>({
      type: TempEffectType.burning,
      damage: 10,
      interval: 500
    })
  ],
  // tempEffects: [{
  //   type: EffectType.healthDecreaseOnMove,
  //   lastTick: Date.now(),
  //   damage: 10,
  //   charges: 10
  // }, {
  //   type: EffectType.healthDecreaseOverTime,
  //   lastTick: Date.now(),
  //   damage: 4,
  //   interval: 5000
  // }],
  inventory: [
    { type: 'consumable/minorRagePotion' },
    { type: 'weapon/greatswordOfGwai' },
    { type: 'consumable/greaterSoma' },
    { type: 'consumable/greaterSoma' },
    null,
    null,
    null,
    { type: 'weapon/berserkerShield' },
    { type: 'weapon/warhammer' }
  ]
}, {
  id: `${ADVENTURER_PREFIX}d299f98a`,
  ...generateAttributesHealthAndXp(),
  // health: 3000,
  equipment: {
    [EquipmentSlotType.mainHand]: { type: 'weapon/spear' }
  },
  name: 'Mike Keith',
  // name: generateRandomName(Race.human),
  flavor: true,

  avatarImg: 'human/male/m_19.png',
  spritesheet: 'KNIGHT_SPEAR',
  traits: [Trait.arrowFinder],
  race: Race.human,
  gender: Gender.male,
  skills: {
    [WeaponType.poleArm]: 13
  },
  tempEffects: [],
  inventory: [
    { type: 'consumable/lesserRagePotion' },
    null,
    null,
    null,
    null,
    { type: 'weapon/khopesh' },
    { type: 'apparel/hornedHelmet' },
    { type: 'weapon/woodenBulwark' }]
}, {
  id: `${ADVENTURER_PREFIX}96c686c3`,
  equipment: {},
  ...generateAttributesHealthAndXp(),
  name: 'Wayne Monroe',
  flavor: true,

  avatarImg: 'human/male/m_08.png',
  spritesheet: 'TROLL_AXE',
  traits: [Trait.houseMonroe, Trait.arrowFinder],
  race: Race.troll,
  gender: Gender.male,
  skills: {
    [WeaponType.axe]: 12
  },
  tempEffects: [],
  inventory: [null, null, null, { type: 'weapon/goldenShield' }]
}, {
  id: `${ADVENTURER_PREFIX}250d1a9d`,
  ...generateAttributesHealthAndXp(),
  name: 'Alexis Ortiz',
  // name: generateRandomName(Race.human, true),
  flavor: true,

  avatarImg: 'human/female/f_10.png',
  spritesheet: 'KNIGHT_SWORD',
  inventory: [null, null, null, null, null],
  race: Race.human,
  gender: Gender.male,
  skills: {
    [WeaponType.axe]: 10
  },
  equipment: {
    [EquipmentSlotType.mainHand]: { type: 'weapon/longbow' },
    [EquipmentSlotType.offHand]: { type: 'ammunition/basicArrows', quantity: 50 }
  },
  tempEffects: []
}, {
  id: `${ADVENTURER_PREFIX}169384ef`,
  ...generateAttributesHealthAndXp(),
  name: 'Karlee Nolan',
  // name: generateRandomName(Race.troll),
  flavor: true,

  avatarImg: 'human/female/f_16.png',
  spritesheet: 'TROLL_SWORD',
  inventory: [{ type: 'weapon/greatswordOfGwai' }, null, null, null],
  race: Race.troll,
  gender: Gender.male,
  skills: {
    [WeaponType.axe]: 10
  },
  equipment: {
    [EquipmentSlotType.mainHand]: { type: 'weapon/simpleCrossbow' },
    [EquipmentSlotType.offHand]: { type: 'ammunition/crossbowBolts', quantity: 40 }
  },
  tempEffects: []
}, {
  id: `${ADVENTURER_PREFIX}f22d66cb`,
  ...generateAttributesHealthAndXp(),
  equipment: {},
  name: 'Gylbarde the Earnest',

  avatarImg: 'human/male/m_09.png',
  spritesheet: 'KNIGHT_SWORD',
  inventory: [null, null, null, null, null],
  race: Race.human,
  gender: Gender.male,
  skills: {
    [WeaponType.axe]: 13
  },
  tempEffects: []
}, {
  id: `${ADVENTURER_PREFIX}36c686c1`,
  equipment: {},
  ...generateAttributesHealthAndXp(),
  name: 'Lanslet of the Water',

  avatarImg: 'human/male/m_26.png',
  spritesheet: 'KNIGHT_SWORD',
  inventory: [{ type: 'weapon/greatswordOfGwai' }, null, null, null, { type: 'apparel/shoulders1' }, { type: 'apparel/fedora' }, { type: 'apparel/greaves2' }],
  race: Race.human,
  gender: Gender.male,
  skills: {
    [WeaponType.axe]: 3
  },
  tempEffects: []
}, {
  id: `${ADVENTURER_PREFIX}12c613d4`,
  equipment: {},
  ...generateAttributesHealthAndXp(),
  name: 'Tedric the Bold',
  // name: generateRandomName(Race.human, true),

  avatarImg: 'human/male/m_33.png',
  spritesheet: 'KNIGHT_SWORD',
  inventory: [{ type: 'weapon/greatswordOfGwai' }, null, null, null],
  race: Race.human,
  gender: Gender.male,
  skills: {
    [WeaponType.axe]: 10
  },
  tempEffects: [
    createTempEffect<TempEffectBrokenLegs>({
      type: TempEffectType.brokenLegs,
      damage: 8,
      charges: 10
    })
  ]
}, {
  id: `${ADVENTURER_PREFIX}5a402ef1`,
  equipment: {
    [EquipmentSlotType.head]: { type: 'apparel/crimsonRogueCoif', durability: 0.25 },
    [EquipmentSlotType.chest]: { type: 'apparel/crimsonRogueTunic', durability: 0.5 },
    [EquipmentSlotType.hands]: { type: 'apparel/crimsonRogueGrips' },
    [EquipmentSlotType.shoulders]: { type: 'apparel/crimsonRogueSpaulders' },
    [EquipmentSlotType.legs]: { type: 'apparel/crimsonRogueBritches' },
    [EquipmentSlotType.feet]: { type: 'apparel/crimsonRogueBoots' },
    [EquipmentSlotType.mainHand]: { type: 'weapon/dagger' },
    [EquipmentSlotType.offHand]: { type: 'weapon/dagger' }
  },
  ...generateAttributesHealthAndXp(),
  name: 'Allynna Nerilar',
  // name: generateRandomName(Race.elf),
  flavor: true,
  traits: [Trait.houseMaddox, Trait.gloomy],
  avatarImg: 'human/female/f_21.png',
  spritesheet: 'ELF_BOW',
  race: Race.elf,
  gender: Gender.male,
  color: AdventurerColor.purple,
  skills: {
    [WeaponType.knife]: 15,
    [WeaponType.bow]: 11
  },
  tempEffects: [],
  inventory: [{ type: 'deed/lumbermill' }, null, { type: 'weapon/simpleCrossbow' }, { type: 'weapon/dagger' }, { type: 'weapon/khopesh' }, null, { type: 'weapon/steelSword' }, null, { type: 'consumable/lesserSoma' }, { type: 'consumable/minorSoma' }, { type: 'consumable/greaterManaPotion' }, { type: 'consumable/majorHealthPotion' }, null, { type: 'weapon/steelShield' }, null, null, null, null]
}]

function generateAvatarImage (race: Race, gender: Gender) {
  return randomItem(getAvatarImages(race, gender))
}

function getAvatarImages (race: Race, gender: Gender) {
  switch (race) {
    case Race.elf: {
      if (gender === Gender.female) {
        return [
          'elf/female/elf_female_bg.png',
          'elf/female/elf_female_druid_bg.png'
        ]
      }
      return [
        'elf/male/elf_male_bg.png',
        'elf/male/elf_male_thief_bg.png'
      ]
    }
    case Race.human: {
      if (gender === Gender.female) {
        return [
          'human/female/f_01.png',
          'human/female/f_02.png',
          'human/female/f_03.png',
          'human/female/f_04.png',
          'human/female/f_05.png',
          'human/female/f_06.png',
          'human/female/f_07.png',
          'human/female/f_08.png',
          'human/female/f_09.png',
          'human/female/f_10.png',
          'human/female/f_11.png',
          'human/female/f_12.png',
          'human/female/f_13.png',
          'human/female/f_14.png',
          'human/female/f_15.png',
          'human/female/f_16.png',
          'human/female/f_17.png',
          'human/female/f_19.png',
          'human/female/f_20.png',
          'human/female/f_21.png'
        ]
      }
      return [
        'human/male/m_01.png',
        'human/male/m_02.png',
        'human/male/m_03.png',
        'human/male/m_04.png',
        'human/male/m_05.png',
        'human/male/m_06.png',
        'human/male/m_07.png',
        'human/male/m_08.png',
        'human/male/m_09.png',
        'human/male/m_10.png',
        'human/male/m_11.png',
        'human/male/m_12.png',
        'human/male/m_13.png',
        'human/male/m_14.png',
        'human/male/m_15.png',
        'human/male/m_16.png',
        'human/male/m_17.png',
        'human/male/m_18.png',
        'human/male/m_19.png',
        'human/male/m_20.png',
        'human/male/m_21.png',
        'human/male/m_22.png',
        'human/male/m_23.png',
        'human/male/m_24.png',
        'human/male/m_25.png',
        'human/male/m_26.png',
        'human/male/m_27.png',
        'human/male/m_28.png',
        'human/male/m_29.png',
        'human/male/m_30.png',
        'human/male/m_31.png',
        'human/male/m_32.png',
        'human/male/m_33.png',
        'human/male/m_34.png',
        'human/male/m_35.png',
        'human/male/m_36.png'
      ]
    }
    case Race.orc: {
      return [
        'orc/orc_01.png',
        'orc/orc_02.png',
        'orc/orc_03.png',
        'orc/orc_04.png',
        'orc/orc_05.png',
        'orc/orc_male_barbarian_bg.png',
        'orc/orc_male_bg.png'
      ]
    }
    case Race.troll: {
      return [
        'troll/goblin_01.png',
        'troll/goblin_02.png',
        'troll/goblin_03.png',
        'troll/goblin_04.png'
      ]
    }
    case Race.undead: {
      return [
        'undead/Undead_Female_Warrior_bg.png',
        'undead/Undead_Male_Dark_Priest_bg.png',
        'undead/Undead_Necromancer_bg.png',
        'undead/skeleton_01.png',
        'undead/skeleton_02.png',
        'undead/skeleton_03.png',
        'undead/skeleton_04.png',
        'undead/skeleton_05.png',
        'undead/skeleton_06.png',
        'undead/skeleton_07.png'
      ]
    }
  }
}

function defineSpritesheet (race: Race): keyof typeof sprites.actors {
  switch (race) {
    case Race.elf: {
      return 'ELF_BOW'
    }
    case Race.human: {
      return randomItem(['KNIGHT_SPEAR', 'KNIGHT_SWORD'])
    }
    case Race.orc: {
      return 'ORC_AXE'
    }
    case Race.troll: {
      return randomItem(['TROLL_AXE', 'TROLL_SWORD'])
    }
    case Race.undead: {
      return 'SKELETON'
    }
  }
}
// To generate a random 11 digit number, use: Math.random().toString(36).substring(2)

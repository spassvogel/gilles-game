import { type AdventurerAction } from 'store/actions/adventurers'
import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot'
import { type Reducer } from 'redux'
import { AdventurerColor, type AdventurerStoreState, type AttributesStoreState } from 'store/types/adventurer'
import { Trait } from 'definitions/traits/types'
import { levelToXp, MAX_XP, xpToLevel } from 'mechanics/adventurers/levels'
import { type Action } from 'store/actions'
import { getDefinition, isConsumable } from 'definitions/items/consumables'
import { type Item } from 'definitions/items/types'
import { getDefinition as getApparelDefinition, isApparel } from 'definitions/items/apparel'
import { type Effect } from 'definitions/effects/types'
import { calculateBaseHitpoints } from 'mechanics/adventurers/hitpoints'
import { type TempEffectBrokenLegs, type TempEffectBurning, TempEffectType } from 'definitions/tempEffects/types'
import { createTempEffect } from 'definitions/tempEffects'
import { WeaponType } from 'definitions/weaponTypes/types'
import { decreaseDurability } from 'mechanics/combat'
import { Race } from 'constants/race'

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
const avatarImgBasePath = '/img/avatars/'
export const ADVENTURER_PREFIX = 'adv_'

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
  room: 0,
  name: 'Sasha Falcon',
  flavor: true,
  traits: [Trait.houseMaddox, Trait.gloomy],
  avatarImg: `${avatarImgBasePath}female/f_14.png`,
  spritesheet: 'SCENE_ACTOR_ELF_BOW',
  color: AdventurerColor.purple,
  race: Race.elf,
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
  flavor: true,

  room: 1,
  avatarImg: `${avatarImgBasePath}female/f_16.png`,
  spritesheet: 'SCENE_ACTOR_ELF_BOW',
  color: AdventurerColor.teal,
  traits: [Trait.houseHouston],
  race: Race.human,
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
  flavor: true,

  room: 2,
  traits: [Trait.gloomy],
  race: Race.undead,
  skills: {
    [WeaponType.sword]: 12,
    [WeaponType.hammer]: 6
  },
  avatarImg: `${avatarImgBasePath}male/m_36.png`,
  spritesheet: 'SCENE_ACTOR_SKELETON',
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
  flavor: true,

  room: 4,
  avatarImg: `${avatarImgBasePath}male/m_19.png`,
  spritesheet: 'SCENE_ACTOR_KNIGHT_SPEAR',
  traits: [Trait.arrowFinder],
  race: Race.human,
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

  room: 5,
  avatarImg: `${avatarImgBasePath}male/m_08.png`,
  spritesheet: 'SCENE_ACTOR_TROLL_AXE',
  traits: [Trait.houseMonroe, Trait.arrowFinder],
  race: Race.troll,
  skills: {
    [WeaponType.axe]: 12
  },
  tempEffects: [],
  inventory: [null, null, null, { type: 'weapon/goldenShield' }]
}, {
  id: `${ADVENTURER_PREFIX}250d1a9d`,
  ...generateAttributesHealthAndXp(),
  name: 'Alexis Ortiz ',
  flavor: true,

  room: 9,
  avatarImg: `${avatarImgBasePath}female/f_10.png`,
  spritesheet: 'SCENE_ACTOR_KNIGHT_SWORD',
  inventory: [null, null, null, null, null],
  race: Race.human,
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
  flavor: true,

  room: 3,
  avatarImg: `${avatarImgBasePath}female/f_16.png`,
  spritesheet: 'SCENE_ACTOR_TROLL_SWORD',
  inventory: [{ type: 'weapon/greatswordOfGwai' }, null, null, null],
  race: Race.troll,
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

  room: 8,
  avatarImg: `${avatarImgBasePath}male/m_09.png`,
  spritesheet: 'SCENE_ACTOR_KNIGHT_SWORD',
  inventory: [null, null, null, null, null],
  race: Race.human,
  skills: {
    [WeaponType.axe]: 13
  },
  tempEffects: []
}, {
  id: `${ADVENTURER_PREFIX}36c686c1`,
  equipment: {},
  ...generateAttributesHealthAndXp(),
  name: 'Lanslet of the Water',

  room: 6,
  avatarImg: `${avatarImgBasePath}male/m_26.png`,
  spritesheet: 'SCENE_ACTOR_KNIGHT_SWORD',
  inventory: [{ type: 'weapon/greatswordOfGwai' }, null, null, null, { type: 'apparel/shoulders1' }, { type: 'apparel/fedora' }, { type: 'apparel/greaves2' }],
  race: Race.human,
  skills: {
    [WeaponType.axe]: 3
  },
  tempEffects: []
}, {
  id: `${ADVENTURER_PREFIX}12c613d4`,
  equipment: {},
  ...generateAttributesHealthAndXp(),
  name: 'Tedric the Bold',

  room: 7,
  avatarImg: `${avatarImgBasePath}male/m_33.png`,
  spritesheet: 'SCENE_ACTOR_KNIGHT_SWORD',
  inventory: [{ type: 'weapon/greatswordOfGwai' }, null, null, null],
  race: Race.human,
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
  room: 11,
  name: 'Allynna Nerilar',
  flavor: true,
  traits: [Trait.houseMaddox, Trait.gloomy],
  avatarImg: `${avatarImgBasePath}female/f_21.png`,
  spritesheet: 'SCENE_ACTOR_ELF_BOW',
  race: Race.elf,
  color: AdventurerColor.purple,
  skills: {
    [WeaponType.knife]: 15,
    [WeaponType.bow]: 11
  },
  tempEffects: [],
  inventory: [{ type: 'deed/lumbermill' }, null, { type: 'weapon/simpleCrossbow' }, { type: 'weapon/dagger' }, { type: 'weapon/khopesh' }, null, { type: 'weapon/steelSword' }, null, { type: 'consumable/lesserSoma' }, { type: 'consumable/minorSoma' }, { type: 'consumable/greaterManaPotion' }, { type: 'consumable/majorHealthPotion' }, null, { type: 'weapon/steelShield' }, null, null, null, null]
}]

// To generate a random 11 digit number, use: Math.random().toString(36).substring(2)

// eslint-disable-next-line @typescript-eslint/default-param-last
export const adventurers: Reducer<AdventurerStoreState[], AdventurerAction> = (state: AdventurerStoreState[] = initialAdventurers, action: Action) => {
  switch (action.type) {
    // Changes adventurers health
    case 'modifyHealth': {
      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          const health = adventurer.health + action.amount
          return {
            ...adventurer,
            health
          }
        }
        return adventurer
      })
    }

    // Consumes a potion
    case 'consumeItem': {
      const { adventurerId, fromSlot } = action
      const adventurer = state.find((a) => a.id === adventurerId)
      if (adventurer == null) {
        throw new Error(`No adventurer ${adventurerId} found`)
      }
      let { health } = adventurer
      const consumable = adventurer.inventory[fromSlot]
      if ((consumable == null) || !isConsumable(consumable.type)) {
        throw new Error(`No potion found at index ${fromSlot} `)
      }
      const definition = getDefinition(consumable.type)
      switch (definition.category) {
        case 'health':
          health = Math.min((definition.effect ?? 0) + health, 100)
          break
        case 'soma':
          // handled by effects middleware
          console.log(`${adventurer.name} drinks a soma potion`)
          break
        case 'mana':
          console.log(`${adventurer.name} drinks a mana potion`)
          break
      }

      // take item from the inventory
      const inventory = adventurer.inventory.map((element, index) => index !== fromSlot ? element : null)
      return state.map((a: AdventurerStoreState) => {
        if (a === adventurer) {
          return {
            ...a,
            health,
            inventory
          }
        }
        return a
      })
    }

    // Moves an item from one inventory slot to another
    case 'moveItemInInventory': {
      const { adventurerId, fromSlot, toSlot } = action
      const adventurer = state.find((a) => a.id === adventurerId)
      if (adventurer == null) {
        throw new Error(`No adventurer ${adventurerId} found`)
      }
      const inventory = adventurer.inventory.map((element, index) => {
        if (index === fromSlot) { return adventurer.inventory[toSlot] }
        if (index === toSlot) { return adventurer.inventory[fromSlot] }
        return element
      })

      return state.map((element: AdventurerStoreState) => {
        if (element === adventurer) {
          return {
            ...element,
            inventory
          }
        }
        return element
      })
    }

    case 'moveItemToOtherAdventurer': {
      // Moves an item from one adventurer to another
      const { adventurerId: fromAdventurerId, fromSlot, toAdventurerId } = action
      const fromAdventurer = state.find((a) => a.id === fromAdventurerId)
      if (fromAdventurer == null) return state
      const item = fromAdventurer.inventory[fromSlot]

      return state.map((element: AdventurerStoreState) => {
        if (element.id === fromAdventurerId) {
          // Clear out the item from this adventurer
          const inventory = element.inventory.concat()
          inventory[fromSlot] = null
          return {
            ...element,
            inventory
          }
        } else if (element.id === toAdventurerId) {
          // Find first empty slot, add there
          const inventory = element.inventory.concat()
          const index = inventory.findIndex((slot) => slot === null)
          inventory[index] = item
          // todo: what if there is no room?
          return {
            ...element,
            inventory
          }
        }
        return element
      })
    }

    case 'addItemToInventory': {
      const { item } = action
      let { toSlot } = action

      return state.map((element: AdventurerStoreState) => {
        if (element.id === action.adventurerId) {
          const inventory = element.inventory.concat()
          if (toSlot === null || toSlot === undefined) {
            toSlot = inventory.findIndex((val) => (val === null || val === undefined))
          }
          inventory[toSlot] = item
          // todo: check if no space
          return {
            ...element,
            inventory
          }
        }
        return element
      })
    }

    case 'removeItemFromInventory': {
      const { fromSlot } = action

      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          const inventory = adventurer.inventory.map((element, index) => index !== fromSlot ? element : null)
          return {
            ...adventurer,
            inventory
          }
        }
        return adventurer
      })
    }

    case 'changeItemQuantity': {
      // Change quantity of an item in invntory
      const { slot, quantity } = action

      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          const inventory = adventurer.inventory.map((item, index) => index !== slot
            ? item
            : ({
                ...item,
                quantity
              }) as Item)
          return {
            ...adventurer,
            inventory
          }
        }
        return adventurer
      })
    }

    case 'assignEquipment': {
      // Assigns equipment to an adventurer
      const { equipmentSlot, item } = action
      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          return {
            ...adventurer,
            equipment: {
              ...adventurer.equipment,
              [equipmentSlot]: item
            }
          }
        }
        return adventurer
      })
    }

    case 'removeEquipment': {
      // Assigns equipment to an adventurer
      const { equipmentSlot } = action

      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          return {
            ...adventurer,
            equipment: {
              ...adventurer.equipment,
              [equipmentSlot]: null
            }
          }
        }
        return adventurer
      })
    }

    case 'changeEquipmentQuantity': {
      // Change quantity of an item equipped
      const { equipmentSlot, quantity } = action

      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          return {
            ...adventurer,
            equipment: {
              ...adventurer.equipment,
              [equipmentSlot]: {
                ...adventurer.equipment[equipmentSlot],
                quantity
              }
            }
          }
        }
        return adventurer
      })
    }

    case 'apparelTakeDamage': {
      const adventurer = state.find((a) => a.id === action.adventurerId)
      const equipment = adventurer?.equipment[action.bodyPart]
      if ((equipment == null) || adventurer == null || !isApparel(equipment.type)) {
        return state
      }
      const definition = getApparelDefinition(equipment.type)
      const armor = definition.damageReduction ?? 1
      const diff = decreaseDurability(armor, action.damage)
      const durability = (adventurer.equipment[action.bodyPart]?.durability ?? 1) - diff

      return state.map((a: AdventurerStoreState) => {
        if (a === adventurer) {
          return {
            ...adventurer,
            equipment: {
              ...adventurer.equipment,
              [action.bodyPart]: {
                ...adventurer.equipment[action.bodyPart],
                durability
              }
            }
          }
        }
        return a
      })
    }

    case 'addTempEffect': {
      // adds an effect
      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          return {
            ...adventurer,
            tempEffects: [
              action.tempEffect,
              ...adventurer.tempEffects
            ]
          }
        }
        return adventurer
      })
    }

    case 'decreaseEffectCharge': {
      // decreases charges of given effect by 1
      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          return {
            ...adventurer,
            tempEffects: adventurer.tempEffects.map((tE) => ({
              ...tE,
              effects: tE.effects.reduce<Effect[]>((acc, value) => {
                if (value === action.effect) {
                  const charges = value.charges ?? 0
                  // if charges is < 2 remove from list
                  if ((charges) > 1) {
                    acc.push({
                      ...value,
                      charges: charges - 1
                    })
                  }
                } else {
                  acc.push(value)
                }
                return acc
              }, [])
            }))
          }
        }
        return adventurer
      })
    }

    case 'decreaseTempEffectCharge': {
      // decreases charges of given temp effect by 1
      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          let shouldCleanup = false
          let tempEffects = adventurer.tempEffects.map((tE) => {
            if (tE === action.effect) {
              const charges = (tE.charges ?? 1) - 1

              if (charges === 0) {
                // marked for cleanup
                shouldCleanup = true
              }
              return {
                ...tE,
                charges
              }
            }
            return tE
          })

          if (shouldCleanup) {
            tempEffects = tempEffects.filter((tE) => (tE.charges ?? 0) > 0)
          }

          return {
            ...adventurer,
            tempEffects
          }
        }
        return adventurer
      })
    }

    case 'renameAdventurer': {
      // Rename adventurer
      const { name } = action
      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          return {
            ...adventurer,
            name
          }
        }
        return adventurer
      })
    }

    case 'setBasicAttributes': {
      // Used for debugging only, update BA of an adventurer
      const { basicAttributes } = action
      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          return {
            ...adventurer,
            basicAttributes
          }
        }
        return adventurer
      })
    }

    case 'addXp': {
      // Adds xp
      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          const oldLevel = xpToLevel(adventurer.xp)
          const xp = Math.min(adventurer.xp + action.xp, MAX_XP)
          const newLevel = xpToLevel(xp)
          let health = adventurer.health
          if (newLevel > oldLevel) {
            // When achieving a new level, immediately get full health
            health = calculateBaseHitpoints(newLevel, adventurer.basicAttributes.for)
          }
          return {
            ...adventurer,
            xp,
            health
          }
        }
        return adventurer
      })
    }
  }
  return state
  // debug: this will auto-increase the levels of every adventurer at every tick
  // return state.map((adventurer: AdventurerStoreState) => {
  //   return {
  //     ...adventurer,
  //     xp: adventurer.xp + 1
  //   }
  // })
}

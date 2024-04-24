import { type AdventurerAction } from 'store/actions/adventurers'
import { type Reducer } from 'redux'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { MAX_XP, xpToLevel } from 'mechanics/adventurers/levels'
import { type Action } from 'store/actions'
import { getDefinition, isConsumable } from 'definitions/items/consumables'
import { type Item } from 'definitions/items/types'
import { getDefinition as getApparelDefinition, isApparel } from 'definitions/items/apparel'
import { type Effect } from 'definitions/effects/types'
import { calculateBaseHitpoints } from 'mechanics/adventurers/hitpoints'
import { decreaseDurability } from 'mechanics/combat'
import { initialAdventurers } from 'mechanics/adventurers/generator'

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

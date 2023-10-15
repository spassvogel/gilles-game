import weaponsmithProduction from './weaponsmith'
import armoursmithProduction from './armoursmith'
import { type Structure } from 'definitions/structures'
import { type ProductionDefinition } from './types'
import workshopProduction from './workshop'
// import alchemistProduction from './alchemist'
import { isWeapon } from 'definitions/items/weapons'
import { isApparel } from 'definitions/items/apparel'
import { isQuestItem } from 'definitions/items/questItems'
import { type ProducableItem } from 'store/types/structure'

// Returns the structure that produces given Item, or null if this Item is not produced anywhere
export const getProductionStructureForItem = (item: ProducableItem): Structure | null => {
  // if (alchemistProduction[item]){
  //   return Structure.alchemist
  // }
  if (isApparel(item) && (armoursmithProduction[item] != null)) {
    return 'armoursmith'
  }
  if (isWeapon(item) && (weaponsmithProduction[item] != null)) {
    return 'weaponsmith'
  }
  if (isQuestItem(item) && (workshopProduction[item] != null)) {
    return 'workshop'
  }
  return null
}

const all = {
  // ...alchemistProduction,
  ...armoursmithProduction,
  ...weaponsmithProduction,
  ...workshopProduction
}

export const getDefinition = (item: ProducableItem): ProductionDefinition => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return all[item]!
}

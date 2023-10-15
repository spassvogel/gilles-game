import { Rarity } from 'constants/items'
import { type ItemDefinition } from 'definitions/items/types'

export const getItemNameClassName = (item: ItemDefinition): string => {
  const { rarity } = item
  switch (rarity) {
    case Rarity.common:
      return 'item-name-common'
    case Rarity.uncommon:
      return 'item-name-uncommon'
    case Rarity.rare:
      return 'item-name-rare'
    case Rarity.epic:
      return 'item-name-epic'
    case Rarity.legendary:
      return 'item-name-legendary'
  }
  return 'item-name-common'
}

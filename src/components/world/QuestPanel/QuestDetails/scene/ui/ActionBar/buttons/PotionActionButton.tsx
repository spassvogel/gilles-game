import { type ComponentProps } from 'react'
import ActionButton from './ActionButton'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { isConsumable } from 'definitions/items/consumables'

type Props = ComponentProps<typeof ActionButton> & {
  adventurer: AdventurerStoreState
}

/**
 * This button will open the potion secondary bar
 */
const PotionActionButton = (props: Props) => {
  const { adventurer, ...restProps } = props

  const consumables = adventurer.inventory.filter((i) => i != null && isConsumable(i.type))
  if (consumables.length === 0) {
    return null
  }
  return (
    <ActionButton { ...restProps}>
      <img className="action-icon" src="/img/ui/icons/round-potion.svg"></img>
    </ActionButton>
  )
}

export default PotionActionButton

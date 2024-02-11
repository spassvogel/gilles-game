import { IconSize } from 'components/ui/common/Icon'
import ItemIcon from 'components/ui/items/ItemIcon'
import { type Consumable, isConsumable } from 'definitions/items/consumables'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { type ActionIntent } from '../../SceneUI'
import { type Item } from 'definitions/items/types'
import { SceneActionType } from 'store/types/scene'
import { useContext } from 'react'
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext'

import '../styles/secondaryActionBar.scss'
import '../styles/secondaryActionBarPotion.scss'

type Props = {
  adventurer: AdventurerStoreState
  activeIntent?: ActionIntent
  onSetActionIntent: (intent?: ActionIntent) => void
}

const isNotNullAndAConsumable = (item: Item | null): item is Item<Consumable> => {
  return item != null && isConsumable(item.type)
}

const PotionSecondaryActionBar = (props: Props) => {
  const { adventurer, onSetActionIntent, activeIntent, ...restProps } = props
  const consumables = adventurer.inventory.filter(isNotNullAndAConsumable)
  const controller = useContext(SceneControllerContext)

  console.log('consumables', consumables)

  const handleClick = (item: Item<Consumable>) => {
    const actor = controller?.getSceneActor(adventurer.id)
    if (actor == null) {
      return
    }
    onSetActionIntent({
      action: SceneActionType.consume,
      actor,
      isValid: true,
      item
    })
  }

  return (
    <div className="secondary-action-bar potions">
      {consumables.map((item, i) => (
        <div className={`potion ${activeIntent?.action === SceneActionType.consume && activeIntent.item === item ? 'active' : ''}`}>
          <ItemIcon
            size={IconSize.medium}
            item={item} key={i + item.type}
            onClick={() => { handleClick(item) }}
          />
        </div>
      ))}
    </div>
  )
}

export default PotionSecondaryActionBar

import { useAdventurer } from 'hooks/store/adventurers'
import * as TextManager from 'global/TextManager'
import DraggableItemIcon, { type InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon'
import { useMemo } from 'react'
import ConsumeItemSlot from './ConsumeItemSlot'
import Button from 'components/ui/buttons/Button'
import { DragSourceType } from 'constants/dragging'
import { IconSize } from 'components/ui/common/Icon'
import { consumeItem } from 'store/actions/adventurers'
import { useDispatch } from 'react-redux'
import { addLogText } from 'store/actions/log'
import { LogChannel } from 'store/types/logEntry'
import { useQuest } from 'hooks/store/quests'
import { AP_COST_CONSUME } from 'mechanics/combat'
import { Channel, SoundManager } from 'global/SoundManager'
import { isConsumable } from 'definitions/items/consumables'

import './styles/consumeItem.scss'

export type Props = {
  adventurerId: string
  questName?: string
  fromSlot?: number

  onDrop?: (index: number) => void
  onConsumed?: () => void
}

// not sure if this is even used
const ConsumeItem = (props: Props) => {
  const { adventurerId, questName, fromSlot, onDrop, onConsumed } = props
  const adventurer = useAdventurer(adventurerId)
  const quest = useQuest(questName ?? '')
  const dispatch = useDispatch()
  const combat = ((quest?.scene?.combat) ?? false) // if in combat mode, you have to pay AP to consume an item

  // this component is not used in combat
  // const ap = useMemo(() => {
  //   return getAdventurer(quest?.scene?.objects ?? [], adventurerId)?.ap ?? 0
  // }, [quest, adventurerId])

  // const enoughAp = ap >= AP_COST_CONSUME

  const handleDrop = (dragInfo: InventoryItemDragInfo) => {
    if (dragInfo.inventorySlot !== undefined) {
      onDrop?.(dragInfo.inventorySlot)
    }
  }

  const item = useMemo(() => {
    if (fromSlot === undefined) return null
    return adventurer?.inventory[fromSlot]
  }, [adventurer, fromSlot])

  const handleConsumeItem = () => {
    if (adventurerId == null || fromSlot == null) return
    const consumable = adventurer.inventory[fromSlot]
    if ((consumable == null) || !isConsumable(consumable.type)) {
      throw new Error(`No potion found at index ${fromSlot} `)
    }

    dispatch(consumeItem(adventurerId, fromSlot))
    void SoundManager.playSound('SCENE_DRINKING', Channel.scene)
    onConsumed?.()

    // Add log entry
    if (adventurer !== undefined) {
      dispatch(addLogText('adventurer-drink-potion', { item, adventurer: adventurerId }, LogChannel.common))
    }
  }

  return (
    <fieldset className="consume-item">
      <legend>{TextManager.get('ui-adventurer-info-use-item')}</legend>
      <div className="content">

        <ConsumeItemSlot onDrop={handleDrop}>
          {(item != null) && (
             <DraggableItemIcon
              index={0}
              sourceId={adventurerId}
              sourceType={DragSourceType.adventurerConsumeItem}
              item={item}
              size={IconSize.small}
            />
          )}
        </ConsumeItemSlot>
        <Button
          className="consume-button"
          onClick={handleConsumeItem}
          disabled={(item == null) || (combat)}
        >
          {TextManager.get('ui-adventurer-info-use-item')}
          {combat && ' ' + TextManager.get('ui-adventurer-info-use-item-ap-cost', { ap: AP_COST_CONSUME })}
        </Button>
      </div>
    </fieldset>
  )
}
export default ConsumeItem

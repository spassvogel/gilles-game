import { useEffect, useState } from 'react'
import { DragSourceType } from 'constants/dragging'
import Inventory from 'components/ui/inventory/Inventory'
import useItemDropActions from 'hooks/actions/useItemActions'
import { type EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot'
import { type InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon'
import { type Item } from 'definitions/items/types'
import { useAdventurer } from 'hooks/store/adventurers'
import Level from 'components/ui/adventurer/AdventurerPanel/Level'
import ApIndicator from './ApIndicator'
import AdventurerTraits from './AdventurerTraits'
import AdventurerEquipment from './AdventurerEquipment'
import * as TextManager from 'global/TextManager'
import ReactMarkdown from 'react-markdown'
import Health from './Health'
import ConsumeItem from './ConsumeItem'
import AdventurerEffects from './AdventurerEffects'
import AdventurerAttributesAndSkills from './AdventurerAttributesAndSkills'
import { defineAssetPath } from 'utils/assets'

import './styles/adventurerPanel.scss'

export type Props = {
  adventurerId: string
  questName?: string
  horizontalMode?: boolean

  name?: boolean // whether to show the adventurer name
  levelBar?: boolean // whether to show the level bar
  effects?: boolean // whether to show effects
  traits?: boolean // whether to show traits
  skills?: boolean // whether to show skills

  onStartInventoryItemDrag?: (item: Item, fromSlot: number) => void
}

/** Vertical panel showing adventurer info
 */
const AdventurerPanel = (props: Props) => {
  const {
    adventurerId,
    questName,
    horizontalMode,
    name = true,
    levelBar = true,
    effects = true,
    traits = true,
    skills = true,
    onStartInventoryItemDrag
  } = props
  const adventurer = useAdventurer(adventurerId)
  const {
    dropItemEquipment,
    dropItemInventory
  } = useItemDropActions()

  const handleDropItemEquipment = (dragInfo: InventoryItemDragInfo, slotType: EquipmentSlotType) => {
    dropItemEquipment(dragInfo, slotType, adventurer)
  }
  const [consumeItemIndex, setConsumeItemIndex] = useState<number>()

  const handleDropItemInventory = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string) => {
    if (sourceType === DragSourceType.adventurerConsumeItem) {
      setConsumeItemIndex(undefined)
    } else {
      dropItemInventory(item, fromSlot, toSlot, sourceType, adventurer, sourceId)
    }
  }

  const handleDropConsumeItem = (fromSlot: number) => {
    setConsumeItemIndex(fromSlot)
  }

  useEffect(() => {
    // selecting another adventurer cancels the consume intent
    setConsumeItemIndex(undefined)
  }, [adventurerId])

  const handleItemConsumed = () => {
    setConsumeItemIndex(undefined)
  }

  if (adventurer == null) return null

  return (
    <div className={`adventurer-panel${(horizontalMode === true ? ' horizontal' : '')}`}>
       <section id="common">
         <div className="info">
         { name && (
          <div className="name">
            <h3 className="title">{adventurer.name}</h3>
            {questName !== undefined && <ApIndicator questName={questName} adventurer={adventurer} />}
          </div>
         )}
        { levelBar && adventurer.health > 0 && <Level adventurerId={adventurer.id}/> }
        { adventurer.flavor === true && (
          <span className="flavor">
            <img className="portrait" src={defineAssetPath(adventurer.avatarImg)} alt={adventurer.name} />
            <ReactMarkdown>
              {TextManager.getAdventurerFlavor(adventurer.id, adventurer.name)}
            </ReactMarkdown>
          </span>
        )}
        <Health adventurerId={adventurer.id}/>
        { effects && <AdventurerEffects adventurerId={adventurerId}/> }
        { traits && <AdventurerTraits adventurerId={adventurerId}/> }
        </div>
      </section>
      <AdventurerAttributesAndSkills adventurerId={adventurerId} skills={skills} />
      <section id="equipment">
        <div className="equipment">
          <h3 className='title'>{TextManager.get('ui-adventurer-info-equipment-title')}</h3>
          <AdventurerEquipment
            adventurerId={adventurerId}
            onDropItemEquipment={handleDropItemEquipment}
          />
        </div>
      </section>
      <section id="inventory">
        <h3 className='title'>{TextManager.get('ui-adventurer-info-inventory-title')}</h3>
        <Inventory
          sourceType={DragSourceType.adventurerInventory}
          sourceId={adventurerId}
          disabledIndex={consumeItemIndex}
          items={adventurer.inventory}
          onDropItem={handleDropItemInventory}
          onStartDrag={onStartInventoryItemDrag}
        />
        <ConsumeItem
          adventurerId={adventurer.id}
          questName={questName}
          fromSlot={consumeItemIndex}
          onDrop={handleDropConsumeItem}
          onConsumed={handleItemConsumed}
        />
      </section>
    </div>
  )
}

export default AdventurerPanel

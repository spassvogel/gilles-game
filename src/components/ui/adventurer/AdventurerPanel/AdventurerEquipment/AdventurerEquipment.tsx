import EquipmentSlot, { EquipmentSlotType, rangedWeaponInHand } from 'components/ui/adventurer/EquipmentSlot'
import { type Item } from 'definitions/items/types'
import DraggableItemIcon, { type InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon'
import { DragSourceType } from 'constants/dragging'
import * as TextManager from 'global/TextManager'
import { IconSize } from 'components/ui/common/Icon'
import Guy from './Guy'
import { useAdventurer } from 'hooks/store/adventurers'
import './styles/adventurerEquipment.scss'

export type Props = {
  adventurerId: string
  onDropItemEquipment: (dragInfo: InventoryItemDragInfo, slotType: EquipmentSlotType) => void
}

// Shows the gear an adventurer is wearing
const AdventurerEquipment = (props: Props) => {
  const { adventurerId, onDropItemEquipment } = props
  const adventurer = useAdventurer(adventurerId)

  const getEquipmentSlot = (slotType: EquipmentSlotType) => {
    // returns EquipmentSlot
    const item: Item | undefined = adventurer.equipment[slotType]
    let text = TextManager.getEquipmentSlot(slotType)

    if (slotType === EquipmentSlotType.offHand) {
      // If there a ranged weapon in the main hand the offHand is for ammo
      if (rangedWeaponInHand(adventurer.equipment)) {
        text = TextManager.get('ui-equipmentslot-ammunition')
      }
    }
    const handleDrop = (dragInfo: InventoryItemDragInfo) => {
      onDropItemEquipment(dragInfo, slotType)
    }

    return (
      <li className={EquipmentSlotType[slotType]}>
        <EquipmentSlot
          onDrop={handleDrop}
          adventurerId={adventurerId}
          type={slotType}
        >
          {(item != null) && (
            <DraggableItemIcon
              index={slotType}
              sourceId={adventurer.id}
              sourceType={DragSourceType.adventurerEquipment}
              item={item}
              size={IconSize.medium}
            />
          )}
        </EquipmentSlot>
        <span className="info">
          {text}
        </span>
      </li>
    )
  }

  return (
    <ul className="adventurer-equipment">
      {getEquipmentSlot(EquipmentSlotType.head)}
      {getEquipmentSlot(EquipmentSlotType.chest)}
      {getEquipmentSlot(EquipmentSlotType.hands)}
      {getEquipmentSlot(EquipmentSlotType.shoulders)}
      {getEquipmentSlot(EquipmentSlotType.legs)}
      {getEquipmentSlot(EquipmentSlotType.feet)}
      {getEquipmentSlot(EquipmentSlotType.mainHand)}
      {getEquipmentSlot(EquipmentSlotType.offHand)}
      <Guy adventurerId={adventurer.id} />
    </ul>
  )
}

export default AdventurerEquipment

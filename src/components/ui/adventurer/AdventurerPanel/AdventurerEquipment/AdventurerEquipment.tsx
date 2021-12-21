import { AdventurerStoreState } from 'store/types/adventurer';
import EquipmentSlot, { EquipmentSlotType, rangedWeaponInHand } from 'components/ui/adventurer/EquipmentSlot';
import { Item } from 'definitions/items/types';
import DraggableItemIcon, { InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon';
import { DragSourceType } from 'constants/dragging';
import { TextManager } from 'global/TextManager';
import { IconSize } from 'components/ui/common/Icon';
import Guy from './Guy';
import './styles/adventurerEquipment.scss';

export interface Props {
  adventurer: AdventurerStoreState
  onDropItemEquipment: (dragInfo: InventoryItemDragInfo, slotType: EquipmentSlotType) => void;
}

// Shows the gear an adventurer is wearing
const AdventurerEquipment = (props: Props) => {
  const { adventurer, onDropItemEquipment } = props;

  const getEquipmentSlot = (slotType: EquipmentSlotType) => {
    // returns EquipmentSlot
    const item: Item | undefined = adventurer.equipment[slotType];
    let text = TextManager.getEquipmentSlot(slotType);

    if (slotType === EquipmentSlotType.offHand) {
      // If there a ranged weapon in the main hand the offHand is for ammo
      if (rangedWeaponInHand(adventurer.equipment)) {
        text = TextManager.get("ui-equipmentslot-ammunition");
      }
    }
    return (
      <li className={EquipmentSlotType[slotType]}>
        <EquipmentSlot
          onDrop={(dragInfo: InventoryItemDragInfo) => onDropItemEquipment(dragInfo, slotType)}
          type={slotType}
        >
          {item && (
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
    );
  };

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

export default AdventurerEquipment;



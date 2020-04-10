import React from "react";
import { AdventurerStoreState } from 'stores/adventurer';
import EquipmentSlot, { EquipmentSlotType } from 'components/ui/EquipmentSlot';
import { Item } from 'definitions/items/types';
import DraggableItemIcon, { InventoryItemDragInfo } from 'components/ui/DraggableItemIcon';
import { DragSourceType } from 'constants/dragging';
import { IconSize } from 'constants/icons';
import { TextManager } from 'global/TextManager';

export interface Props {
    adventurer: AdventurerStoreState
    onDropItemEquipment: (dragInfo: InventoryItemDragInfo, slotType: EquipmentSlotType) => void;
}

const AdventurerEquipment = (props: Props) => {
    const { adventurer, onDropItemEquipment } = props;

    const getEquipmentSlot = (slotType: EquipmentSlotType) => {
        // returns EquipmentSlot
        const item: Item | undefined = adventurer.equipment[EquipmentSlotType[slotType]];
        let contents = null;
        if (item) {
            const itemRef: React.RefObject<any> = React.createRef();

            contents = (
                <DraggableItemIcon
                    index={slotType}
                    sourceId={adventurer.id}
                    sourceType={DragSourceType.adventurerEquipment}
                    item={item}
                    ref={itemRef}
                    size={IconSize.medium}
                />
            );
        }

        return (
            <>
                <EquipmentSlot
                    onDrop={(dragInfo: InventoryItemDragInfo) => onDropItemEquipment(dragInfo, slotType)}
                    type={slotType}
                >
                    {contents}
                </EquipmentSlot>
                <span className="info">{TextManager.get(`ui-equipmentslot-${EquipmentSlotType[slotType]}`)}</span>
            </>
        );
    };
    return (
        <ul>
            <li>{getEquipmentSlot(EquipmentSlotType.head)}</li>
            <li>{getEquipmentSlot(EquipmentSlotType.shoulders)}</li>
            <li>{getEquipmentSlot(EquipmentSlotType.chest)}</li>
            <li>{getEquipmentSlot(EquipmentSlotType.hands)}</li>
            <li>{getEquipmentSlot(EquipmentSlotType.legs)}</li>
            <li>{getEquipmentSlot(EquipmentSlotType.feet)}</li>
            <li>{getEquipmentSlot(EquipmentSlotType.mainHand)}</li>
            <li>{getEquipmentSlot(EquipmentSlotType.offHand)}</li>
        </ul>
    )
}

export default AdventurerEquipment;
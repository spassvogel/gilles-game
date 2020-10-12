import * as React from "react";
import { ContextType } from "constants/context";
import { DragSourceType } from "constants/dragging";
import { IconSize } from "constants/icons";
import { getDefinition } from "definitions/items";
import { Item } from "definitions/items/types";
import { TextManager } from "global/TextManager";
import DraggableItemIcon, { InventoryItemDragInfo } from "../../ItemIcon/DraggableItemIcon";
import EquipmentSlot, { EquipmentSlotType } from "../../EquipmentSlot";
import Inventory from "../../inventory/Inventory";
import { TooltipManager } from 'global/TooltipManager';
import useItemDropActions from 'hooks/actions/useItemActions';
import { useAdventurerState } from 'hooks/store/adventurers';
import "./styles/adventurerinfo.scss";
import Level from './Level';

export interface Props {
    adventurerId: string;
}


// Used in warehouse
const AdventurerInfo = (props: Props) => {

    const adventurer = useAdventurerState(props.adventurerId);

    const {
        dropItemEquipment,
        dropItemInventory
    } = useItemDropActions()

    const handleDropItemEquipment = (dragInfo: InventoryItemDragInfo, slotType: EquipmentSlotType) => {
        dropItemEquipment(dragInfo, slotType, adventurer);
    };

    const handleDropItemInventory = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string): void => {
        dropItemInventory(item, fromSlot, toSlot, sourceType, adventurer, sourceId);
    };

    const getEquipmentSlot = (slotType: EquipmentSlotType) => {
        // returns EquipmentSlot
        const item: Item | undefined = adventurer.equipment[EquipmentSlotType[slotType]];
        let contents = null;
        if (item) {
            const itemRef: React.RefObject<any> = React.createRef();
            const handleClick = (event: React.MouseEvent) => {
                const origin = (event.currentTarget as HTMLElement);
                const originRect = origin.getBoundingClientRect();
                TooltipManager.showContextTooltip(ContextType.item, getDefinition(item), originRect);
                event.stopPropagation();
            };

            contents = (
                <DraggableItemIcon
                    index={slotType}
                    sourceId={adventurer.id}
                    sourceType={DragSourceType.adventurerEquipment}
                    item={item}
                    onClick={handleClick}
                    ref={itemRef}
                    size={IconSize.medium}
                />
            );
        }

        return (
            <>
                <EquipmentSlot
                    onDrop={(dragInfo: InventoryItemDragInfo) => handleDropItemEquipment(dragInfo, slotType)}
                    type={slotType}
                >
                    {contents}
                </EquipmentSlot>
                <span className="info">{TextManager.getEquipmentSlot(slotType)}</span>
            </>
        );
    };

    const equipmentList = (
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
    );

    return (
        <div className="adventurer-info">
            <div className="left">
                <div className="name">
                    <b>{adventurer.name}</b>
                </div>
                <Level xp={adventurer.xp} />
                <div className="attributes">
                    { Object.keys(adventurer.basicAttributes).map((stat) => {
                        const value: number = adventurer.basicAttributes[stat];
                        return (
                            <div key={`${adventurer.id}-${stat}`} >
                                 <b>{stat}</b>: {value.toFixed(1)}
                            </div>
                        );
                    })}
                </div>
                <div className="equipment">
                    {equipmentList}
                </div>
            </div>
            <div className="right">
                <Inventory
                    sourceType={DragSourceType.adventurerInventory}
                    sourceId={adventurer.id}
                    items={adventurer.inventory}
                    onDropItem={handleDropItemInventory}
                />
            </div>
        </div>
    );
};

export default AdventurerInfo;

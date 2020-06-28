import { ContextType } from "constants/context";
import { DragSourceType } from "constants/dragging";
import { IconSize } from "constants/icons";
import { getDefinition } from "definitions/items";
import { Item } from "definitions/items/types";
import * as React from "react";
import { AdventurerStoreState } from "stores/adventurer";
import { TextManager } from "global/TextManager";
import "./css/adventurerinfo.css";
import DraggableItemIcon, { InventoryItemDragInfo } from "./DraggableItemIcon";
import EquipmentSlot, { EquipmentSlotType } from "./EquipmentSlot";
import Inventory from "./inventory/Inventory";
import { TooltipManager } from 'global/TooltipManager';
import useItemDropActions from 'hooks/actions/useItemActions';

export interface Props {
    adventurerId: string;
}

export interface DispatchProps {
    onMoveItemInInventory: (adventurerId: string, fromSlot: number, toSlot: number) => void;
    onRemoveItemFromInventory: (adventurerId: string, fromSlot: number) => void;
    onAssignEquipment: (adventurerId: string, equipmentSlot: EquipmentSlotType, item: Item) => void;
    onAddItemToInventory: (adventurerId: string, item: Item, toSlot: number) => void;
    onMoveItemFromWarehouseToInventory: (adventurerId: string, fromSlot: number, toSlot: number, item: Item, otherItem: Item|null) => void;
    onRemoveEquipment: (adventurerId: string, equipmentSlot: EquipmentSlotType) => void;
    onAddItemToWarehouse: (item: Item, toSlot: number) => void;
    onAssignEquipmentFromWarehouse: (adventurerId: string, fromSlot: number, item: Item, equipmentSlot: EquipmentSlotType) => void;
}

export interface StateProps {
    adventurer: AdventurerStoreState;
    warehouse: (Item|null)[];
}

type AllProps = Props & DispatchProps & StateProps;

// Used in warehouse
const AdventurerInfo = (props: AllProps) => {

    const adventurer = props.adventurer;
    const attributes = Object.keys(adventurer.stats).map((stat) => {
        const value: number = adventurer.stats[stat];
        return <div key={`${adventurer.id}-${stat}`} > <b>{stat}</b>: {value.toFixed(1)} </div>;
    });

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
                <span className="info">{TextManager.get(`ui-equipmentslot-${EquipmentSlotType[slotType]}`)}</span>
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
                <div className="attributes">
                    {attributes}
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

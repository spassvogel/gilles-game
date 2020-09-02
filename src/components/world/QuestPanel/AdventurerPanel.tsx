import React from "react";
import { AdventurerStoreState } from 'stores/adventurer';
import { DragSourceType } from 'constants/dragging';
import AdventurerEquipment from './AdventurerEquipment';
import Inventory from 'components/ui/inventory/Inventory';
import useItemDropActions from 'hooks/actions/useItemActions';
import { InventoryItemDragInfo } from 'components/ui/DraggableItemIcon';
import { EquipmentSlotType } from 'components/ui/EquipmentSlot';
import { Item } from 'definitions/items/types';
import "./css/adventurerPanel.css";
import AdventurerTraits from './AdventurerTraits';

export interface Props {
    adventurer: AdventurerStoreState;
}

/** Vertical panel showing adventurer info
 * todo: move outside of /world
 */
const AdventurerPanel = (props: Props) => {
    const { adventurer } = props;

    // const renderAttributes = () => Object.keys(adventurer.stats).map((stat) => {
    //     const value: number = adventurer.stats[stat];
    //     return <div key={`${adventurer.id}-${stat}`} > <b>{stat}</b>: {value.toFixed(1)} </div>;
    // });

    const {
        dropItemEquipment,
        dropItemInventory
    } = useItemDropActions();

    const handleDropItemEquipment = (dragInfo: InventoryItemDragInfo, slotType: EquipmentSlotType) => {
        dropItemEquipment(dragInfo, slotType, adventurer);
    };
    const handleDropItemInventory = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string) => {
        dropItemInventory(item, fromSlot, toSlot, sourceType, adventurer, sourceId);
    }

    return (
        <div className="adventurer-panel">
            <div className="info">
                <div className="name">
                    <b>{adventurer.name}</b>
                </div>
                <AdventurerTraits adventurerId={adventurer.id}/>
                {/* <div className="renderAttributes">
                    {renderAttributes()}
                </div> */}
            </div>
            <div className="equipment">
                <AdventurerEquipment
                    adventurer={adventurer}
                    onDropItemEquipment={handleDropItemEquipment}
                />
            </div>
            <div className="right">
                <Inventory
                    sourceType={DragSourceType.adventurerInventory}
                    sourceId={adventurer.id}
                    items={adventurer.inventory}
                    className="inventory-small"
                    onDropItem={handleDropItemInventory}
                />
            </div>
        </div>
    )
}

export default AdventurerPanel;
import React, {  } from "react";
import { DragSourceType } from 'constants/dragging';
import Inventory from 'components/ui/inventory/Inventory';
import useItemDropActions from 'hooks/actions/useItemActions';
import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot';
import { InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon';
import { Item } from 'definitions/items/types';
import AdventurerSkills from './AdventurerSkills';
import { useAdventurerState } from 'hooks/store/adventurers';
import Level from 'components/ui/adventurer/AdventurerPanel/Level';
import ApIndicator from './ApIndicator';
import AdventurerTraits from './AdventurerTraits';
import AdventurerEquipment from './AdventurerEquipment';
import "./styles/adventurerPanel.scss";

export interface Props {
    adventurerId: string;
    questName?: string;
    horizontalMode?: boolean;

    name?: boolean; // whether to show the adventurer name
    levelBar?: boolean; // whether to show the level bar
    traits?: boolean; // whether to show traits
    skills?: boolean; // whether to show skills
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
        traits = true,
        skills = true
    } = props;
    const adventurer = useAdventurerState(adventurerId);
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
        <div className={`adventurer-panel${(horizontalMode ? " horizontal" : "")}`}>
            <div className="left">
                <div className="info">
                    { name && (
                        <div className="name">
                            {adventurer.name}
                            {questName && <ApIndicator questName={questName} adventurer={adventurer} />}
                        </div>
                    )}
                    { levelBar && <Level adventurerId={adventurer.id}/> }

                    { traits && <AdventurerTraits adventurerId={adventurer.id}/> }
                    { skills && <AdventurerSkills adventurerId={adventurer.id}/> }
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

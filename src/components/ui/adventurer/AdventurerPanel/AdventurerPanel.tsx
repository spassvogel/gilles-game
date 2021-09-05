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
import { TextManager } from "global/TextManager";
import "./styles/adventurerPanel.scss";
import ReactMarkdown from "react-markdown";
import Health from "./Health";

export interface Props {
    adventurerId: string;
    questName?: string;
    horizontalMode?: boolean;

    name?: boolean; // whether to show the adventurer name
    levelBar?: boolean; // whether to show the level bar
    traits?: boolean; // whether to show traits
    skills?: boolean; // whether to show skills

    onStartInventoryItemDrag?: (item: Item, fromSlot: number) => void;
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
        skills = true,
        onStartInventoryItemDrag
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
           <section id="common">
               <div className="info">
               { name && (
                    <div className="name">
                        {adventurer.name}
                        {questName && <ApIndicator questName={questName} adventurer={adventurer} />}
                    </div>
                )}
                { levelBar && <Level adventurerId={adventurer.id}/> }
                { adventurer.flavor && (
                    <span className="flavor">
                        <ReactMarkdown>
                            {TextManager.getAdventurerFlavor(adventurer.id, adventurer.name)}
                        </ReactMarkdown>
                    </span>
                )}
                <Health adventurerId={adventurer.id}/> 
                { traits && <AdventurerTraits adventurerId={adventurer.id}/> }
                </div>
            </section>
            <section id="skills">
                { skills && <AdventurerSkills adventurerId={adventurer.id}/> }
                {/* <div className="renderAttributes">
                    {renderAttributes()}
                </div> */}
            </section>
            <section id="equipment">
                <div className="equipment">
                    <p>{TextManager.get("ui-adventurer-info-equipment-title")}</p>
                    <AdventurerEquipment
                        adventurer={adventurer}
                        onDropItemEquipment={handleDropItemEquipment}
                    />
                </div>
            </section>
            <section id="inventory">
            <p>{TextManager.get("ui-adventurer-info-inventory-title")}</p>
                <Inventory
                    sourceType={DragSourceType.adventurerInventory}
                    sourceId={adventurer.id}
                    items={adventurer.inventory}
                    className="inventory-small"
                    onDropItem={handleDropItemInventory}
                    onStartDrag={onStartInventoryItemDrag}
                />
            </section>
        </div>
    )
}

export default AdventurerPanel;

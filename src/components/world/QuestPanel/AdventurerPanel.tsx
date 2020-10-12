import React, { useContext, useMemo } from "react";
import { AdventurerStoreState } from 'stores/adventurer';
import { DragSourceType } from 'constants/dragging';
import AdventurerEquipment from './AdventurerEquipment';
import Inventory from 'components/ui/inventory/Inventory';
import useItemDropActions from 'hooks/actions/useItemActions';
import { InventoryItemDragInfo } from 'components/ui/ItemIcon/DraggableItemIcon';
import { EquipmentSlotType } from 'components/ui/EquipmentSlot';
import { Item } from 'definitions/items/types';
import AdventurerTraits from './AdventurerTraits';
import AdventurerSkills from './AdventurerSkills';
import Level from 'components/ui/adventurer/AdventurerInfo/Level';
import useQuest from 'hooks/store/useQuest';
import { SceneControllerContext } from './context/SceneControllerContext';
import "./styles/adventurerPanel.scss";
import { TextManager } from 'global/TextManager';

export interface Props {
    adventurer: AdventurerStoreState;
    questName?: string;
}

/** Vertical panel showing adventurer info
 * todo: move outside of /world
 */
const AdventurerPanel = (props: Props) => {
    const { adventurer, questName } = props;
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
                    {adventurer.name}
                    {questName && <ApIndicator questName={questName} adventurer={adventurer} />}
                </div>
                <Level xp={adventurer.xp} />

                <AdventurerTraits adventurerId={adventurer.id}/>
                <AdventurerSkills adventurerId={adventurer.id}/>
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




/** Vertical panel showing adventurer info
 * todo: move outside of /world
 */
const ApIndicator = (props: Props) => {
    const quest = useQuest(props.questName!);
    const controller = useContext(SceneControllerContext)!;

    const ap = useMemo(() => {
        return controller.getRemainingAdventurerAp(props.adventurer.id)
    }, [controller, props.adventurer.id]);

    if (!quest?.scene?.combat) {
        return null;
    }
    return (
        <span>{TextManager.get("ui-adventurer-info-ap-remaining", { ap })}</span>
    );
}
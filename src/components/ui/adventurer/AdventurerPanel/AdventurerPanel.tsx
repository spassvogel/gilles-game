import React, { useState } from "react";
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
import ReactMarkdown from "react-markdown";
import Health from "./Health";
import Attributes from "./Attributes";
import ConsumeItem from "./ConsumeItem";
import AdventurerEffects from "./AdventurerEffects";
import { useSettings } from "hooks/store/settings";
import DebugAdventurerEdit from "./DebugAdventurerEdit";
import "./styles/adventurerPanel.scss";

export interface Props {
  adventurerId: string;
  questName?: string;
  horizontalMode?: boolean;

  name?: boolean; // whether to show the adventurer name
  levelBar?: boolean; // whether to show the level bar
  effects?: boolean; // whether to show effects
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
    effects = true,
    traits = true,
    skills = true,
    onStartInventoryItemDrag
  } = props;
  const adventurer = useAdventurerState(adventurerId);
  const settings = useSettings();

  const {
    dropItemEquipment,
    dropItemInventory
  } = useItemDropActions();

  const handleDropItemEquipment = (dragInfo: InventoryItemDragInfo, slotType: EquipmentSlotType) => {
    dropItemEquipment(dragInfo, slotType, adventurer);
  };

  const handleDropItemInventory = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string) => {
    if (sourceType === DragSourceType.adventurerConsumeItem) {
      setConsumeItemIndex(undefined)
    } else {
      dropItemInventory(item, fromSlot, toSlot, sourceType, adventurer, sourceId);
    }
  }

  const [consumeItemIndex, setConsumeItemIndex] = useState<number>()
  const handleDropConsumeItem = (fromSlot: number) => {
    setConsumeItemIndex(fromSlot)
  }

  const handleItemConsumed = () => {
    setConsumeItemIndex(undefined);
  }

  return (
    <div className={`adventurer-panel${(horizontalMode ? " horizontal" : "")}`}>
       <section id="common">
         <div className="info">
         { name && (
          <div className="name">
            {adventurer.name}
            {questName && <ApIndicator questName={questName} adventurer={adventurer} />}
            {settings.debugAllowAdventurerEdit && <DebugAdventurerEdit adventurer={adventurer} />}
          </div>
        )}
        { levelBar && <Level adventurerId={adventurer.id}/> }
        { adventurer.flavor && (
          <span className="flavor">
            <img className="portrait" src={adventurer.avatarImg} />
            <ReactMarkdown>
              {TextManager.getAdventurerFlavor(adventurer.id, adventurer.name)}
            </ReactMarkdown>
          </span>
        )}
        <Health adventurerId={adventurer.id}/>
        { effects && <AdventurerEffects adventurerId={adventurer.id}/> }
        { traits && <AdventurerTraits adventurerId={adventurer.id}/> }
        </div>
        <Attributes basicAttributes={adventurer.basicAttributes} />
      </section>
      <section id="skills">
        { skills && <AdventurerSkills adventurerId={adventurer.id}/> }
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
          disabledIndex={consumeItemIndex}
          items={adventurer.inventory}
          className="inventory-small"
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

export default AdventurerPanel;

import React from "react";
import { useAdventurerState } from "hooks/store/adventurers";
import { TextManager } from "global/TextManager";
import DraggableItemIcon, { InventoryItemDragInfo } from "components/ui/items/DraggableItemIcon";
import { useMemo } from "react";
import ConsumeItemSlot from "./ConsumeItemSlot";
import Button from "components/ui/buttons/Button";
import { DragSourceType } from "constants/dragging";
import { IconSize } from "components/ui/common/Icon";
import { consumeItem } from "store/actions/adventurers";
import { useDispatch } from "react-redux";
import { addLogText } from "store/actions/log";
import { LogChannel } from "store/types/logEntry";
import { useQuest } from "hooks/store/quests";
import { getAdventurer } from "store/types/scene";
import { AP_COST_CONSUME } from "mechanics/combat";
import { deductActorAp } from "store/actions/quests";
import { Channel, SoundManager } from "global/SoundManager";
import "./styles/consumeitem.scss";

export interface Props {
  adventurerId: string;
  questName?: string;
  fromSlot?: number;

  onDrop?: (index: number) => void;
  onConsumed?: () => void;
}

const ConsumeItem = (props: Props) => {
  const { adventurerId, questName, fromSlot, onDrop, onConsumed } = props;
  const adventurer = useAdventurerState(adventurerId);
  const quest = useQuest(questName ?? "");
  const dispatch = useDispatch();
  const combat = !!quest?.scene?.combat; // if in combat mode, you have to pay AP to consume an item
  const ap = useMemo(() => {
    return getAdventurer(quest?.scene?.objects ?? [], adventurerId)?.ap ?? 0
  }, [quest, adventurerId]);

  const enoughAp = ap >= AP_COST_CONSUME;

  const handleDrop = (dragInfo: InventoryItemDragInfo) => {
    if (dragInfo.inventorySlot !== undefined){
      onDrop?.(dragInfo.inventorySlot)
    }
  }

  const item = useMemo(() => {
    if (fromSlot === undefined) return undefined;
    return adventurer?.inventory[fromSlot];
  }, [adventurer, fromSlot])

  const handleConsumeItem = () => {
    if (!adventurerId || !fromSlot) return
    if (combat) {
    if (!questName) return
    // Deduct AP from adventurer if in combat
    dispatch(deductActorAp(questName , adventurerId, AP_COST_CONSUME));
    }
    dispatch(consumeItem(adventurerId, fromSlot));
    SoundManager.playSound("scene/drinking", Channel.scene);
    onConsumed?.();

    // Add log entry
    if (adventurer) {
      dispatch(addLogText("adventurer-drink-potion", { item, adventurer }, LogChannel.common));
    }
  }
  return (
    <fieldset className="consume-item">
      <legend>{TextManager.get("ui-adventurer-info-use-item")}</legend>
      <div className="content">

        <ConsumeItemSlot onDrop={handleDrop}>
          {item && (
             <DraggableItemIcon
              index={0}
              sourceId={adventurerId}
              sourceType={DragSourceType.adventurerConsumeItem}
              item={item}
              size={IconSize.small}
            />
          )}
        </ConsumeItemSlot>
        <Button
          className="consume-button"
          onClick={handleConsumeItem}
          disabled={!item || (combat && !enoughAp)}
        >
          {TextManager.get("ui-adventurer-info-use-item")}
          {combat && " " + TextManager.get("ui-adventurer-info-use-item-ap-cost", { ap: AP_COST_CONSUME })}
        </Button>
      </div>
    </fieldset>
  )
}
export default ConsumeItem;

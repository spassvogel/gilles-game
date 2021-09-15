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
import "./styles/consumeitem.scss";

export interface Props {
    adventurerId: string;
    fromSlot?: number;

    onDrop?: (index: number) => void;
    onConsumed?: () => void;
}

const ConsumeItem = (props: Props) => {
    const { adventurerId, fromSlot, onDrop, onConsumed } = props;
    const adventurer = useAdventurerState(adventurerId);
    const dispatch = useDispatch();

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
      dispatch(consumeItem(adventurerId, fromSlot));
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
                    disabled={!item}
                >
                    {TextManager.get("ui-adventurer-info-use-item")}
                </Button>
            </div>
        </fieldset>
    )
}
export default ConsumeItem;

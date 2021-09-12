import * as React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { TextManager } from 'global/TextManager';
import Button from 'components/ui/buttons/Button';
import { Consumable } from "definitions/items/consumables";
import { ItemSource } from "constants/items";
import { DragSourceType } from "constants/dragging";
import { drinkPotion } from "store/actions/adventurers";
import { addLogText } from "store/actions/log";
import { LogChannel } from "store/types/logEntry";
import { StoreState } from "store/types";
import { AdventurerStoreState } from "store/types/adventurer";

interface Props {
    item: Consumable;
    source?: ItemSource;
}

const ConsumableContent = (props: Props) => {
    const { item, source } = props;
    const dispatch = useDispatch();
    const subtext = TextManager.getItemSubtext(item);
    const adventurers = useSelector<StoreState, AdventurerStoreState[]>(store => store.adventurers);

    const handleDrink = () => {
        if (!source?.id || !source?.slot) return
        dispatch(drinkPotion(source.id, source.slot));

        // Add log entry
        const adventurer = adventurers.find(a => a.id === source.id)?.name
        if (adventurer) {
            dispatch(addLogText("adventurer-drink-potion", { item, adventurer }, LogChannel.common));
        }        
    }

    const onAnAdventurer = source && source.origin === DragSourceType.adventurerInventory;
    return (
        <div>
            { subtext && (<p className="subtext">{`"${subtext}"`}</p>)}
            {onAnAdventurer && (
                <Button
                    disabled={false}
                    size="small"
                    onClick={() => handleDrink()}
                >
                    Drink potion
                </Button>
            )}
        </div>
    );

}

export default ConsumableContent;
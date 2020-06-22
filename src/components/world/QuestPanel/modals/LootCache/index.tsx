import React from "react";
import "./lootCache.css";
import useQuest from 'hooks/useQuest';
import DraggableItemsList from 'components/ui/items/DraggableItemsList';
import { TextManager } from 'global/TextManager';
import AdventurerAvatar from 'components/ui/AdventurerAvatar';
import useAdventurer from 'hooks/useAdventurer';
import { DragSourceType } from 'constants/dragging';
import { useDispatch } from 'react-redux';
import { addGold } from 'actions/gold';
import { takeGoldFromCache } from 'actions/quests';
import { addItemToInventory } from 'actions/adventurers';

interface Props {
    questName: string;
    cacheName: string;
    adventurerId: string;
    onClose: () => void;
}

const LootCache = (props: Props) => {
    const dispatch = useDispatch();
    const quest = useQuest(props.questName);
    const {scene} = quest;
    const cache = scene?.caches[props.cacheName];
    const adventurer = useAdventurer(props.adventurerId);

    if (!cache) {
        return null;
    }

    const handleTakeGold = (e: React.MouseEvent) => {
        e.stopPropagation();
        // todo: animate gold flying away

        dispatch(addGold(cache.gold || 0));
        dispatch(takeGoldFromCache(props.questName, props.cacheName))
    }

    const handleTakeAllItems = (e: React.MouseEvent) => {
        e.stopPropagation();

        cache.items.forEach((item) => {
            // todo: see if there is space, if so add
            dispatch(addItemToInventory(props.adventurerId, item))
        })
    }

    return (
        <div className="lootCache">
            <div className="header">
                <div className="title">
                    {cache.title}
                </div>
                <div className="close" onClick={props.onClose} />
            </div>
            { cache.items.length > 0 && (
                <div className="content">
                    <div className="items">
                        <DraggableItemsList
                            items={cache.items}
                            sourceType={DragSourceType.lootCache}
                            sourceId={props.cacheName}
                        />
                    </div>
                    <div className="adventurer">
                        <AdventurerAvatar adventurer={adventurer}/>
                        <button onClick={handleTakeAllItems}>
                            {TextManager.get("quest-common-loot-cache-take-all")}
                        </button>
                    </div>
                </div>
            )}
            { !!cache.gold && (
                <div className="content">
                    <div className="gold">
                        <div
                            className="icon common-icon-medium"
                            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/resources/gold.png)`}}
                        />
                        {TextManager.get("quest-common-loot-cache-gold", { gold: cache.gold })}
                    </div>
                    <div className="take-gold">
                        <button onClick={handleTakeGold}>
                            {TextManager.get("quest-common-loot-cache-take")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LootCache;
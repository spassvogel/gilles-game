import React, { useState, useEffect, useRef, useContext } from "react";
import useQuest from 'hooks/store/useQuest';
import DraggableItemsList from 'components/ui/items/DraggableItemsList';
import { TextManager } from 'global/TextManager';
import AdventurerAvatar from 'components/ui/AdventurerAvatar';
import useAdventurer from 'hooks/store/useAdventurer';
import { DragSourceType } from 'constants/dragging';
import { useDispatch } from 'react-redux';
import { addGold } from 'actions/gold';
import { takeGoldFromCache, takeItemFromCache } from 'actions/quests';
import { addItemToInventory } from 'actions/adventurers';
import { adventurerFreeInventorySlots } from 'storeHelpers';
import { SceneControllerContext } from '../../context/SceneControllerContext';
import "../styles/lootCache.scss";
import "../styles/modal.scss";

interface Props {
    cacheName: string;
    adventurerId: string;
    onClose: () => void;
}

const LootCache = (props: Props) => {
    const dispatch = useDispatch();
    const controller = useContext(SceneControllerContext)!;
    const {questName} = controller;
    const quest = useQuest(questName);
    const {scene} = quest;
    const cache = scene?.caches[props.cacheName];
    const adventurer = useAdventurer(props.adventurerId);
    const [taking, setTaking] = useState(false)
    const freeSlots = adventurerFreeInventorySlots(adventurer);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        // Todo:
        // determine max items to be added to inventory
        // play staggered animation onClick
        // add items immediately
        if (taking && cache && ref.current) {
            const item = cache.items[0];
            if (!item) {
                setTaking(false);
                return;
            }
            ref.current.querySelector(".itemslist .item")?.classList.add("taking");

            if (freeSlots > 0) {
                interval = setTimeout(() => {
                    dispatch(addItemToInventory(props.adventurerId, item));
                    dispatch(takeItemFromCache(questName, props.cacheName, item));
                }, 500);
            }
            else {
                setTaking(false);
            }
        }
        return () => {
            clearInterval(interval);
        }
    }, [cache, freeSlots, dispatch, props.adventurerId, props.cacheName, questName, taking]);

    if (!cache) {
        return null;
    }

    const handleTakeGold = (e: React.MouseEvent) => {
        e.stopPropagation();
        // todo: animate gold flying away

        dispatch(addGold(cache.gold || 0));
        dispatch(takeGoldFromCache(questName, props.cacheName))
    }

    const handleTakeAllItems = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTaking(true);
    }

    return (
        <div className={`interaction-modal loot-cache`} ref={ref}>
            <div className="header">
                <div className="title">
                    {TextManager.get(cache.title)}
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
                        <button onClick={handleTakeAllItems} disabled={freeSlots === 0}>
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
import React, { useRef, useContext } from "react";
import gsap from 'gsap';
import DraggableItemsList from 'components/ui/items/DraggableItemsList';
import { TextManager } from 'global/TextManager';
import AdventurerAvatar from 'components/ui/AdventurerAvatar';
import { DragSourceType } from 'constants/dragging';
import { adventurerFreeInventorySlots } from 'storeHelpers';
import { SceneControllerContext } from '../../context/SceneControllerContext';
import { useAdventurerState } from 'hooks/store/adventurers';
import "../styles/lootCache.scss";
import "../styles/modal.scss";

interface Props {
    cacheName: string;
    adventurerId: string;
    onClose: () => void;
}

const LootCache = (props: Props) => {
    const controller = useContext(SceneControllerContext)!;
    const adventurer = useAdventurerState(props.adventurerId);
    const freeSlots = adventurerFreeInventorySlots(adventurer);
    const ref = useRef<HTMLDivElement>(null);
    const cache = controller.getLootCache(props.cacheName);

    if (!cache) {
        return null;
    }

    const handleTakeGold = (e: React.MouseEvent) => {
        e.stopPropagation();
        // todo: animate gold flying away

        controller.takeGoldFromCache(props.cacheName);
    }

    const handleTakeAllItems = (e: React.MouseEvent) => {
        e.stopPropagation();
        ref.current!.querySelectorAll(".itemslist .item").forEach((el, index) => {
            if (index >= freeSlots) return;
            el.classList.add("taking");
        });
        gsap.to(".itemslist .item.taking", {
            right: "-100%",
            stagger: {
              each: 0.1,
              ease: "power2.inOut",
            },
            onComplete: () => {
                for (let i = 0; i < freeSlots; i++) {
                    controller.takeItemFromCache(0, props.cacheName, adventurer);
                }
            }
        });
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
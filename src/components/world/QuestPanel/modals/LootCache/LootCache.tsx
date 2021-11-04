import React, { useRef, useContext } from "react";
import gsap from 'gsap';
import DraggableItemsList from 'components/ui/items/DraggableItemsList';
import { TextManager } from 'global/TextManager';
import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar';
import { DragSourceType } from 'constants/dragging';
import { SceneControllerContext } from '../../context/SceneControllerContext';
import { useAdventurerState } from 'hooks/store/adventurers';
import Button from 'components/ui/buttons/Button';
import { adventurerFreeInventorySlots } from 'store/helpers/storeHelpers';
import Icon from 'components/ui/common/Icon';
import "../styles/lootCache.scss";
import "../styles/modal.scss";

interface Props {
  cacheName: string;
  adventurerId: string;
  onClose: () => void;
}

const LootCache = (props: Props) => {
  const controller = useContext(SceneControllerContext);

  const adventurer = useAdventurerState(props.adventurerId);
  const freeSlots = adventurerFreeInventorySlots(adventurer);
  const ref = useRef<HTMLDivElement>(null);

  if (!controller) {
    return null;
  }
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
    if (ref.current) {
      ref.current.querySelectorAll(".items-list .item-icon").forEach((el, index) => {
        if (index >= freeSlots) return;
        el.classList.add("taking");
      });
      gsap.to(".items-list .item-icon.taking", {
        right: "-50vw",
        stagger: {
          each: 0.1,
          ease: "power2.inOut",
        },
        onComplete: () => {
          for (let i = 0; i < freeSlots; i++) {
            controller.takeItemFromCache(0, props.cacheName, props.adventurerId);
          }
        }
      });
    }
  }

  return (
    <div className={`interaction-modal loot-cache`} ref={ref}>
      <div className="header">
        <div className="title">
          {TextManager.get(cache.title, { adventurer: adventurer.name })}
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
            <Button onClick={handleTakeAllItems} disabled={freeSlots === 0} size="small">
              {TextManager.get("quest-common-loot-cache-take-all")}
            </Button>
          </div>
        </div>
      )}
      { !!cache.gold && (
        <div className="content">
          <div className="gold">
            <Icon
              image="img/resources/gold.png"
              size="medium"
            />
            {TextManager.get("quest-common-loot-cache-gold", { gold: cache.gold })}
          </div>
          <div className="take-gold">
            <Button onClick={handleTakeGold} size="small">
              {TextManager.get("quest-common-loot-cache-take")}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LootCache;

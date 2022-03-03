import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Point } from 'pixi.js';
import { LongPressDetectEvents, useLongPress } from 'use-long-press';
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import { ContextType } from 'constants/context';
import { Location } from 'utils/tilemap';
import { TooltipManager } from 'global/TooltipManager';
import { useQuest } from 'hooks/store/quests';
import { ActorObject, SceneActionType } from 'store/types/scene';
import { locationEquals } from 'utils/tilemap';
import { convertMouseOrTouchCoords, MouseOrTouchEvent } from 'utils/interaction';
import Bubbles from 'components/ui/bubbles/Bubbles';
import { BubbleLayer } from 'global/BubbleManager';
import { Item } from 'definitions/items/types';
import { Weapon } from 'definitions/items/weapons';
import useCanvasScaler from './hooks/useCanvasScaler';
import NormalUICursor from './NormalUICursor';
import { Ammunition } from 'definitions/items/ammunition';
import { WeaponAbility } from 'definitions/abilities/types';
import './styles/sceneUI.scss';
import AdventurerCombatSceneUI, { Refs } from './AdventurerCombatSceneUI';

export type Props = {
  sceneWidth: number;
  sceneHeight: number;
  selectedActorId: string;
  actionIntent?: ActionIntent;

  onMouseDown?: (location: Location) => void;
  onSetActionIntent: (intent?: ActionIntent) => void;
};

type BaseActionIntent = {
  action: SceneActionType;
  from: Location;
  to: Location;
  actor: ActorObject;
  path?: Location[];  // is undefined when path is invalid
  isValid: boolean;
};

export type WeaponWithAbility = {
  weapon: Item<Weapon>;
  ability: WeaponAbility;
};

export type ActionIntent = BaseActionIntent & {
  // Non combat action
  action: SceneActionType.interact;
} | BaseActionIntent & {
  //
  action: SceneActionType.move;
  apCost?: number;
  actorAP?: number;
} | BaseActionIntent & {
  //
  action: SceneActionType.melee;
  apCost?: number;
  actorAP?: number;
  weaponWithAbility: WeaponWithAbility;
} | BaseActionIntent & {
  action: SceneActionType.shoot;
  apCost?: number;
  actorAP?: number;
  weaponWithAbility: WeaponWithAbility;
  ammo: Item<Ammunition>;
};


// This thing scales itself based on the canvas which should be a sibling of this component
const SceneUI = (props: PropsWithChildren<Props>) => {
  const {
    children,
    selectedActorId,
    actionIntent,
    sceneWidth,
    sceneHeight,
    onMouseDown,
    onSetActionIntent,
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const adventurerCombatRef = useRef<Refs>(null);
  const mouseDownOnCanvas = useRef(false);
  const controller = useContext(SceneControllerContext);
  const quest = useQuest(controller?.questName ?? '');
  const scene = quest.scene;
  const { combat, actionQueue } = scene ?? {};
  const [cursorLocation, setCursorLocation] = useState<Location>();
  const scaler = useCanvasScaler(ref, sceneWidth, sceneHeight);

  useEffect(() => {
    scaler.scale = scaler.recalculate();
  }, [scaler]);

  const findLocation = (e: MouseOrTouchEvent) => {
    if (e.target instanceof Element) {
      const {
        x,
        y,
      } = convertMouseOrTouchCoords(e);
      const rect = (e.target).getBoundingClientRect();
      const convertedX = (x - rect.left) / scaler.scale;
      const convertedY = (y - rect.top) / scaler.scale;

      return controller?.pointToSceneLocation(new Point(convertedX, convertedY));
    }
    throw new Error('You didnt give me the correct event');
  };

  const handleMouseMove = (e: MouseOrTouchEvent<HTMLDivElement>) => {
    if (mouseDownOnCanvas.current) {
      const location = findLocation(e) ?? [0, 0];

      if (controller?.locationIsOutOfBounds(location)) {
        setCursorLocation(undefined);
        onSetActionIntent(undefined);
        return;
      }
      if (!cursorLocation || !locationEquals(location, cursorLocation)){
        setCursorLocation(location);
      }
    }
  };


  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const location = findLocation(e);
    if (!controller || !location || !(e.target instanceof Element)) return;
    const object = controller.getObjectAtLocation(location);
    if (!object || object.type !== 'actor') return;

    // Show context tooltip
    const { tileWidth, tileHeight } = controller.getTileDimensions();
    const width = tileWidth * scaler.scale;
    const height = tileHeight * scaler.scale;
    const rect = (e.target).getBoundingClientRect();
    const x = (location[0] * width) + (rect.left ?? 0);
    const y = (location[1] * height) + (rect.top ?? 0);
    const domRect = DOMRect.fromRect({ x, y, width, height });

    TooltipManager.showContextTooltip(ContextType.actor, object, domRect, '');
    e.stopPropagation();
  };

  const handleMouseDown = (e: MouseOrTouchEvent ) => {
    if (adventurerCombatRef.current?.actionMenuOpen) return;
    if (actionQueue?.length) return; // dont allow new actions to be created

    const location = findLocation(e);
    if (location) onMouseDown?.(location);

    mouseDownOnCanvas.current = true;
    // e.preventDefault();
  };

  const bind = useLongPress((e) => {
    if (e) {
      handleClick(e as React.MouseEvent<HTMLDivElement>);
      e.preventDefault();
      e.stopPropagation();
    }
  }, {
    onStart: (e) => { handleMouseDown(e as MouseOrTouchEvent<HTMLDivElement>);},
    onMove: (e) => { handleMouseMove(e as MouseOrTouchEvent<HTMLDivElement>);},
    captureEvent: true,
    cancelOnMovement: 8,
    detect: LongPressDetectEvents.BOTH,
  });

  const handleMouseUp = (e: MouseOrTouchEvent<HTMLDivElement>) => {
    bind.onMouseUp(e as unknown as React.MouseEvent<Element, MouseEvent>);
    mouseDownOnCanvas.current = false;

    if (!combat) {
      // Not in combat, do the action immediately
      setCursorLocation(undefined);
      if (!actionIntent) {
        return;
      }
      const selectedActorLocation = controller?.getSceneAdventurer(selectedActorId)?.location;
      if (selectedActorLocation && cursorLocation && !locationEquals(selectedActorLocation, cursorLocation) && actionIntent) {
        controller?.actorAttemptAction(actionIntent);
        onSetActionIntent(undefined);
      }
    } else {
      adventurerCombatRef.current?.onMouseUp();
    }

    e.stopPropagation();
  };

  useEffect(() => {
    // Non combat action
    if (!combat && cursorLocation !== undefined) {
      // Handle change of cursor when not in combat
      let action = SceneActionType.move;
      const object = controller?.getObjectAtLocation(cursorLocation);
      if (object?.properties.interactive){
        // We're at an interactive object
        action = SceneActionType.interact;
      }
      const actor = controller?.getSceneAdventurer(selectedActorId);
      if (!action || !actor || !cursorLocation) {
        onSetActionIntent(undefined);
      } else {
        const intent = controller?.createActionIntent(action, actor, cursorLocation);
        if (!intent || intent.action === SceneActionType.move || intent.action === SceneActionType.interact) {
          onSetActionIntent?.(intent);
        }
      }
    }
  }, [cursorLocation, combat, controller, selectedActorId, onSetActionIntent]);

  useEffect(() => {
    // When interacting with the canvas, dont scroll the app
    const onTouch = (e: Event) => {
      if (mouseDownOnCanvas.current) {
        e.preventDefault();
      }
    };

    window.addEventListener('touchmove', onTouch, { passive: false } );
    return () => {
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  useEffect(() => {
    const onLeave = () => {
      if (mouseDownOnCanvas.current){
        mouseDownOnCanvas.current = false;
        setCursorLocation(undefined);
        onSetActionIntent?.(undefined);
      }
    };
    ref.current?.addEventListener('mouseleave', onLeave);
  }, [onSetActionIntent]);

  return (
    <div
      ref={ref}
      className="scene-ui"
      {...bind}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      {children}
      {!scene?.combat && cursorLocation && (
        <NormalUICursor location={cursorLocation} />
      )}
      {scene?.combat && cursorLocation && (
        <AdventurerCombatSceneUI
          ref={adventurerCombatRef}
          cursorLocation={cursorLocation}
          selectedAdventurerId={selectedActorId}
          setCursorLocation={setCursorLocation}
          onSetActionIntent={onSetActionIntent}
        />
      )}
      <Bubbles layer={BubbleLayer.scene} />
    </div>
  );
};

export default SceneUI;

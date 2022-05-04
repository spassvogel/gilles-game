import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useCallback,
  useRef,
  useState,
} from 'react';
import { Point } from 'pixi.js';
import { LongPressDetectEvents, useLongPress } from 'use-long-press';
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import { ContextType } from 'constants/context';
import { Location } from 'utils/tilemap';
import { TooltipManager } from 'global/TooltipManager';
import { useAdventurerActorObject, useQuest } from 'hooks/store/quests';
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
import AdventurerCombatSceneUI, { Refs } from './AdventurerCombatSceneUI';
import './styles/sceneUI.scss';
import { checkIfEnemy } from 'definitions/enemies/types';

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

  // when enemy is selected, this is undefined
  const selectedAdventurer = useAdventurerActorObject(controller?.questName ?? '', selectedActorId);

  useEffect(() => {
    scaler.scale = scaler.recalculate();
  }, [scaler]);

  const findLocation = useCallback((e: MouseOrTouchEvent) => {
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
  }, [controller, scaler.scale]);

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
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handleMouseUp(e as React.MouseEvent);
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

  const handleTouchEnd = useCallback((_e: React.TouchEvent) => {
    mouseDownOnCanvas.current = false;
    if (combat) {
      adventurerCombatRef.current?.onMouseUp();
    } else {
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
    }
  }, [actionIntent, combat, controller, cursorLocation, onSetActionIntent, selectedActorId]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    bind.onMouseUp(e);
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
  }, [actionIntent, bind, combat, controller, cursorLocation, onSetActionIntent, selectedActorId]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  useEffect(() => {
    const mouseUp = (e: MouseEvent) => { handleMouseUp(e as unknown as React.MouseEvent); };
    document.addEventListener('mouseup', mouseUp);
    return () => document.removeEventListener('mouseup', mouseUp);
  }, [handleMouseUp]);

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

    window.addEventListener('touchmove', onTouch, { passive: false });
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

  useEffect(() => {
    const mouseOver = (e: MouseEvent) => {
      if (!combat) {
        return;
      }
      if (!adventurerCombatRef.current || !adventurerCombatRef.current.actionMenuOpen) {
        // dont move cursor when combat dialog is open
        setCursorLocation(findLocation(e) ?? [0, 0]);
      }
    };
    const sceneRef = ref.current;
    if (!sceneRef) return;

    if (!checkIfEnemy(selectedActorId)) {
      sceneRef.addEventListener('mousemove', mouseOver);
    }
    return () => {
      sceneRef.removeEventListener('mousemove', mouseOver);
    };
  }, [combat, findLocation, selectedActorId]);

  return (
    <div
      ref={ref}
      className="scene-ui"
      {...bind}
      onContextMenu={handleContextMenu}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
    >
      {children}
      {!scene?.combat && cursorLocation && (
        <NormalUICursor location={cursorLocation} />
      )}
      {scene?.combat && cursorLocation && !!selectedAdventurer && (
        <AdventurerCombatSceneUI
          ref={adventurerCombatRef}
          cursorLocation={cursorLocation}
          selectedAdventurerId={selectedActorId}
          visible={mouseDownOnCanvas.current}
          setCursorLocation={setCursorLocation}
          onSetActionIntent={onSetActionIntent}
        />
      )}
      <Bubbles layer={BubbleLayer.scene} />
    </div>
  );
};

export default SceneUI;

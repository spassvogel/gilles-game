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
import ActionMenu from './ActionMenu/ActionMenu';
import useCanvasScaler from './hooks/useCanvasScaler';
import CombatUIWidget from './CombatUIWidget';
import NormalUICursor from './NormalUICursor';
import useActionIntents from './hooks/useActionIntents';
import { Ammunition } from 'definitions/items/ammunition';
import './styles/sceneUI.scss';
import { WeaponAbility } from 'definitions/abilities/types';

export interface Props {
  sceneWidth: number;
  sceneHeight: number;
  selectedActorId: string;
  actionIntent?: ActionIntent;

  onMouseDown?: (location: Location) => void;
  onSetActionIntent: (intent?: ActionIntent) => void;
}

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
  const mouseDownOnCanvas = useRef(false);
  const controller = useContext(SceneControllerContext);
  const quest = useQuest(controller?.questName ?? '');
  const scene = quest.scene;
  const { combat } = scene ?? {};
  const [cursorLocation, setCursorLocation] = useState<Location>();
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const scaler = useCanvasScaler(ref, sceneWidth, sceneHeight);
  const combatIntents = useActionIntents(selectedActorId, cursorLocation, combat);

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
    if (actionMenuOpen) return;
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

    // open action
    if (combat) {
      const hasValidIntents = !!combatIntents.length && combatIntents.some(i => i.isValid);
      if (cursorLocation && hasValidIntents){
        setActionMenuOpen(true);
      } else {
        setCursorLocation(undefined);
        setActionMenuOpen(false);
      }
    } else {
      // Not in combat, do the action immediately
      setCursorLocation(undefined);
      if (!actionIntent) {
        return;
      }

      const selectedActorLocation = controller?.getSceneActor(selectedActorId)?.location;
      if (selectedActorLocation && cursorLocation && !locationEquals(selectedActorLocation, cursorLocation) && actionIntent){
        controller?.actorAttemptAction(actionIntent);
      }

      onSetActionIntent?.(undefined);
      e.stopPropagation();
    }
  };

  const handleCloseActionMenu = () => {
    setActionMenuOpen(false);
    setCursorLocation(undefined);
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

      const actor = controller?.getSceneActor(selectedActorId);
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
        <CombatUIWidget
          location={cursorLocation}
          intents={combatIntents}
          selectedActorId={selectedActorId}
        />
      )}
      <Bubbles layer={BubbleLayer.scene} />
      { (actionMenuOpen && cursorLocation && combatIntents) && (
        <ActionMenu
          adventurerId={selectedActorId}
          location={cursorLocation}
          intents={combatIntents}
          onClose={handleCloseActionMenu}
          onSetActionIntent={onSetActionIntent}
        />
      )}
    </div>
  );
};

export default SceneUI;

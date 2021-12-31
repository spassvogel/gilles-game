import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import { ContextType } from 'constants/context';
import { LongPressDetectEvents, useLongPress } from 'use-long-press';
import { TooltipManager } from 'global/TooltipManager';
import { useQuest } from 'hooks/store/quests';
import { Point } from 'pixi.js';
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { ActorObject, SceneActionType } from 'store/types/scene';
import { locationEquals } from 'utils/tilemap';
import CombatUIWidget from './CombatUIWidget';
import NormalUICursor from './NormalUICursor';
import { convertMouseOrTouchCoords, MouseOrTouchEvent } from 'utils/interaction';
import Bubbles from 'components/ui/bubbles/Bubbles';
import { BubbleLayer } from 'global/BubbleManager';
import ActionMenu from './ActionMenu/ActionMenu';
import useCanvasScaler from './hooks/useCanvasScaler';
import "./styles/sceneUI.scss";

export interface Props {
  sceneWidth: number;
  sceneHeight: number;
  selectedActorId: string;
  actionIntent?: ActionIntent;

  onMouseDown?: (location: [number, number]) => void;
  onSetActionIntent: (intent?: ActionIntent) => void;
}

export interface ActionIntent {
  action: SceneActionType.move | SceneActionType.melee | SceneActionType.interact | SceneActionType.shoot;
  from: [number, number];
  to: [number, number];
  apCost?: number;
  actor: ActorObject;
  actorAP?: number;
  path?: [number, number][];  // is undefined when path is invalid
}

// This thing scales itself based on the canvas which should be a sibling of this component
const SceneUI = (props: PropsWithChildren<Props>) => {
  const {
    children,
    selectedActorId,
    actionIntent,
    sceneWidth,
    sceneHeight,
    onMouseDown,
    onSetActionIntent
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const mouseDown = useRef(false);
  const controller = useContext(SceneControllerContext);
  const quest = useQuest(controller?.questName ?? "");
  const scene = quest.scene;
  const { combat } = scene ?? {};
  const [cursorLocation, setCursorLocation] = useState<[number, number]>();
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const scale = useCanvasScaler(ref, sceneWidth, sceneHeight);


  const handleMouseMove = (e: MouseOrTouchEvent<HTMLDivElement>) => {
    if (mouseDown.current) {
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
  }

  const handleMouseDown = (e: MouseOrTouchEvent ) => {
    if (actionMenuOpen) return;
    const location = findLocation(e);
    if (location) onMouseDown?.(location);

    mouseDown.current = true;
    e.preventDefault();
  }

  const bind = useLongPress((e) => {
    if (e){
      handleClick(e as React.MouseEvent<HTMLDivElement>);
      e.preventDefault();
      e.stopPropagation();
    }
  }, {
    onStart: (e) => { handleMouseDown(e as MouseOrTouchEvent<HTMLDivElement>);},
    onMove: (e) => { handleMouseMove(e as MouseOrTouchEvent<HTMLDivElement>)},
    captureEvent: true,
    cancelOnMovement: 8,
    detect: LongPressDetectEvents.BOTH
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const location = findLocation(e);
    if (!controller || !location || !(e.target instanceof Element)) return;
    const object = controller.getObjectAtLocation(location);
    if (!object || object.type !== "actor") return;

    // Show context tooltip
    const { tileWidth, tileHeight } = controller.getTileDimensions();
    const width = tileWidth * scale;
    const height = tileHeight * scale;
    const rect = (e.target).getBoundingClientRect();
    const x = (location[0] * width) + (rect.left ?? 0);
    const y = (location[1] * height) + (rect.top ?? 0);
    const domRect = DOMRect.fromRect({ x, y, width, height });

    TooltipManager.showContextTooltip(ContextType.actor, object, domRect, "");
    e.stopPropagation()
  }

  const handleMouseUp = (e: MouseOrTouchEvent<HTMLDivElement>) => {
    bind.onMouseUp(e as unknown as React.MouseEvent<Element, MouseEvent>);
    mouseDown.current = false;

    // open action
    if (combat) {
      if (cursorLocation){
        setActionMenuOpen(true);
      } else {
        setCursorLocation(undefined);
        setActionMenuOpen(false);
      }
    } else {
      // Not in combat, do the action immediately
      setCursorLocation(undefined);
      if (!actionIntent) {
        return
      }

      const selectedActorLocation = controller?.getSceneActor(selectedActorId)?.location;
      if (selectedActorLocation && cursorLocation && !locationEquals(selectedActorLocation, cursorLocation) && actionIntent){
        controller?.actorAttemptAction(actionIntent);
      }

      onSetActionIntent?.(undefined);
      e.stopPropagation();
    }
  }

  const handleCombatActionChange = useCallback((action?: SceneActionType) => {
    const actor = controller?.getSceneActor(selectedActorId);
    if (!action || !actor || !cursorLocation) {
      onSetActionIntent(undefined);
      return;
    }

    const intent = controller?.createActionIntent(action, actor, cursorLocation)
    onSetActionIntent?.(intent)

  }, [controller, cursorLocation, onSetActionIntent, selectedActorId]);

  const handleCloseActionMenu = () => {
    setActionMenuOpen(false);
    setCursorLocation(undefined);
  }

  useEffect(() => {
    if (!combat && cursorLocation !== undefined) {
      // Handle change of cursor when not in combat
      let action = SceneActionType.move;
      const object = controller?.getObjectAtLocation(cursorLocation);
      if(object?.properties.interactive){
        // We're at an interactive object
        action = SceneActionType.interact;
      }
      handleCombatActionChange(action);
    }
  }, [cursorLocation, handleCombatActionChange, combat, controller]);

  const findLocation = (e: MouseOrTouchEvent) => {
    if (e.target instanceof Element) {
      const {
        x,
        y
      } = convertMouseOrTouchCoords(e);
      const rect = (e.target).getBoundingClientRect();
      const convertedX = (x - rect.left) / scale;
      const convertedY = (y - rect.top) / scale;

      return controller?.pointToSceneLocation(new Point(convertedX, convertedY));
    }
    throw new Error("You didnt give me the correct event")
  }

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
          selectedActorId={selectedActorId}
        />
      )}
      <Bubbles layer={BubbleLayer.scene} />
      { (actionMenuOpen && cursorLocation) && (
        <ActionMenu
          adventurerId={selectedActorId}
          location={cursorLocation}
          onClose={handleCloseActionMenu}
          onSetActionIntent={onSetActionIntent}
        />
      )}
    </div>
  )
}

export default SceneUI;

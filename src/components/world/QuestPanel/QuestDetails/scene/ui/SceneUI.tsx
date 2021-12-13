import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import { ContextType } from 'constants/context';
import { LongPressDetectEvents, useLongPress } from 'use-long-press';
import { TooltipManager } from 'global/TooltipManager';
import { useQuest } from 'hooks/store/quests';
import { AP_COST_SHOOT } from 'mechanics/combat';
import { Point } from 'pixi.js';
import React, {
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { SceneActionType } from 'store/types/scene';
import { locationEquals } from 'utils/tilemap';
import CombatUIWidget from './CombatUIWidget';
import NormalUICursor from './NormalUICursor';
import "./styles/sceneUI.scss";
import { convertMouseOrTouchCoords, MouseOrTouchEvent } from 'utils/interaction';

export interface Props {
  sceneWidth: number;
  sceneHeight: number;
  selectedActorId: string;
  actionIntent?: ActionIntent;

  onMouseDown?: (location: [number, number]) => void;
  onSetActionIntent: (intent?: ActionIntent) => void;
}

export interface ActionIntent {
  action: SceneActionType.move | SceneActionType.slash | SceneActionType.interact | SceneActionType.shoot;
  from: [number, number];
  to: [number, number];
  apCost?: number;
  actor: string;
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
  const scale = useRef(1);
  const controller = useContext(SceneControllerContext);
  const quest = useQuest(controller?.questName ?? "");
  const scene = quest.scene;
  const {combat} = scene ?? {};
  const [cursorLocation, setCursorLocation] = useState<[number, number]>();

  useEffect(() => {
    // Scale the html element together with the sibling canvas
    const handleResize = () => {
      if (!ref.current) return;
      const canvas = ref.current.parentNode?.querySelector("canvas");
      if (!canvas) throw Error("No canvas found as sibling of SceneUI");

      const currentWidth = canvas?.clientWidth;
      scale.current = currentWidth/sceneWidth;
      ref.current.style.transform = `scale(${scale.current})`;
      ref.current.style.width = `${sceneWidth}px`;
      ref.current.style.height = `${sceneHeight}px`;
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [sceneHeight, sceneWidth]);

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
    cancelOnMovement: 32,
    detect: LongPressDetectEvents.BOTH
  });


  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const location = findLocation(e);
    if (!controller || !location || !(e.target instanceof Element)) return;
    const object = controller.getObjectAtLocation(location);
    if (!object || object.type !== "actor") return;

    // Show context tooltip
    const { tileWidth, tileHeight } = controller.getTileDimensions()
    const width = tileWidth * scale.current;
    const height = tileHeight * scale.current;
    const rect = (e.target).getBoundingClientRect();
    const x = (location[0] * width) + (rect.left ?? 0);
    const y = (location[1] * height) + (rect.top ?? 0);
    const domRect = DOMRect.fromRect({ x, y, width, height })

    TooltipManager.showContextTooltip(ContextType.actor, object, domRect, "");
    e.stopPropagation()
  }

  const handleMouseUp = (e: MouseOrTouchEvent<HTMLDivElement>) => {
    bind.onMouseUp(e as unknown as React.MouseEvent<Element, MouseEvent>);
    mouseDown.current = false;

    setCursorLocation(undefined); // uncomment to debug
    if (!actionIntent) {
      return
    }
    const selectedActorLocation = controller?.getSceneActor(selectedActorId)?.location;
    if (selectedActorLocation && cursorLocation && !locationEquals(selectedActorLocation, cursorLocation)){
      controller?.actorAttemptAction(selectedActorId, actionIntent.action, actionIntent.to);
    }
    onSetActionIntent?.(undefined);
    e.stopPropagation();
  }

  const handleCombatActionChange = useCallback((action?: SceneActionType) => { // todo: beter name, not just combat
    if (!action) {
      onSetActionIntent(undefined);
      return;
    }
    const {
      location: from = [0, 0],
      ap: actorAP,
    } = controller?.getSceneActor(selectedActorId) ?? {};
    const to = cursorLocation ?? [0, 0];
    switch (action){
      case SceneActionType.move:
        case SceneActionType.slash: {
        const path = controller?.findPath(from, to);
        const apCost = combat ? controller?.calculateWalkApCosts(from, to) : undefined;

        onSetActionIntent({
          action,
          from,
          to,
          apCost,
          actor: selectedActorId,
          actorAP,
          path,
        })
      }
      break;
      case SceneActionType.interact: {
        const path = controller?.findPathNearest(from, to, true);
        const apCost = 0; // can only inspect out of combat?

        onSetActionIntent({
          action,
          from,
          to,
          apCost,
          actor: selectedActorId,
          actorAP,
          path,
        })
      }
      break;
      case SceneActionType.shoot: {
        const apCost = AP_COST_SHOOT;

        onSetActionIntent({
          action,
          from,
          to,
          apCost,
          actor: selectedActorId,
          actorAP,
        })
      }
    }
  }, [combat, controller, cursorLocation, onSetActionIntent, selectedActorId]);

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
      const convertedX = (x - rect.left) / scale.current;
      const convertedY = (y - rect.top) / scale.current;

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
          actionIntent={actionIntent}
          onActionChange={handleCombatActionChange}
        />
      )}
    </div>
  )
}

export default SceneUI;

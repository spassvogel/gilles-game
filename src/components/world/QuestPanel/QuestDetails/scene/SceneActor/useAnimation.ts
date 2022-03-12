import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'pixi.js';
import { gsap } from 'gsap';
import { useQuest } from 'hooks/store/quests';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import { CombatController } from 'mechanics/scenes/CombatController';
import { completeSceneAction } from 'store/actions/quests';
import { StoreState } from 'store/types';
import { getUniqueName, SceneAction, SceneActionType } from 'store/types/scene';
import { Location } from 'utils/tilemap';
import { Orientation } from '.';

export const allAnimations = ['stand', 'attack', 'walk', 'die'] as const;
export type Animation = typeof allAnimations[number];

const useAnimation = (
  controller: BaseSceneController<unknown>,
  actorRef: RefObject<Container>,
  actorName: string,
  location: Location,
  health: number,
  setOrientation: (o: Orientation) => void,
) => {
  const { tileWidth, tileHeight } = controller.getTileDimensions();
  const previousAction = useRef<SceneAction>();
  const timeout = useRef<NodeJS.Timeout>();
  const dispatch = useDispatch();
  const quest = useQuest(controller.questName);

  const actionQueueSelector = useCallback(() => {
    if (!quest.scene?.actionQueue) {
      return [];
    }
    return quest.scene.actionQueue.filter(a => (getUniqueName(a.intent.actor) === actorName));
  }, [quest.scene, actorName]);

  // const actionQueueIntentsSelector = useCallback(() => {
  //   if (!quest.scene?.actionQueue) {
  //     return [];
  //   }
  //   return quest.scene.actionQueue.reduce<ActionIntent[]>((acc, value) => {
  //     const intentsForThisActor = value.actions.filter((i) => (getUniqueName(i.actor) === actorName));
  //     if (intentsForThisActor.length) {
  //       return [
  //         ...acc,
  //         ...intentsForThisActor,
  //       ];
  //     }
  //     return acc;
  //   }, []);
  // }, [quest.scene, actorName]);

  const actionQueue = useSelector<StoreState, SceneAction[]>(actionQueueSelector);
  const [animation, setAnimation] = useState<Animation>('stand');
  const tween = useRef<gsap.core.Tween>();
  const nextAction = actionQueue[0];

  useEffect(() => {
    if (health <= 0) {
      setAnimation('die');
    }
  }, [health]);

  // Handle actions
  useEffect(() => {
    // Determines orientation based on where the target is
    const determineOrientation = () => {
      if (location[0] === nextAction.intent.to[0] && location[1] > nextAction.intent.to[1]) {
        setOrientation(Orientation.north);
      } else if (location[0] < nextAction.intent.to[0] && location[1] > nextAction.intent.to[1]) {
        setOrientation(Orientation.northEast);
      } else if (location[0] < nextAction.intent.to[0] && location[1] === nextAction.intent.to[1]) {
        setOrientation(Orientation.east);
      } else if (location[0] < nextAction.intent.to[0] && location[1] < nextAction.intent.to[1]) {
        setOrientation(Orientation.southEast);
      } else if (location[0] === nextAction.intent.to[0] && location[1] < nextAction.intent.to[1]) {
        setOrientation(Orientation.south);
      } else if (location[0] > nextAction.intent.to[0] && location[1] < nextAction.intent.to[1]) {
        setOrientation(Orientation.southWest);
      } else if (location[0] > nextAction.intent.to[0] && location[1] === nextAction.intent.to[1]) {
        setOrientation(Orientation.west);
      } else if (location[0] > nextAction.intent.to[0] && location[1] > nextAction.intent.to[1]) {
        setOrientation(Orientation.northWest);
      }
    };
    if (nextAction && nextAction !== previousAction.current) {
      const { intent } = nextAction;
      // console.log(`next action is ${nextAction.intent.to} (${nextAction.actionType}), \ncurrent location is: ${location}\nprev action was ${previousAction?.current?.target} `)
      switch (nextAction.intent.action) {
        case SceneActionType.move: {
          const moveComplete = () => {
            setAnimation('stand');
            console.log('completing an action', actorName, quest.name);
            dispatch(completeSceneAction(quest.name, actorName));
            controller.actorMoved(actorName, nextAction.intent.to);
          };

          const duration = (nextAction.endsAt - performance.now()) / 1000;
          if (duration < 0) {
            moveComplete();
          }

          // determine orientation
          determineOrientation();
          setAnimation('walk');
          gsap.killTweensOf(actorRef.current);
          tween.current = gsap.to(actorRef.current, {
            duration,
            ease: 'linear',
            pixi: {
              x: nextAction.intent.to[0] * tileWidth,
              y: nextAction.intent.to[1] * tileHeight,
            },
            onComplete: moveComplete,
          });
          break;
        }
        case SceneActionType.melee: {
          determineOrientation();
          setAnimation('attack');
          CombatController.actorMeleeStart(actorName, intent);

          const attackComplete = () => {
            setAnimation('stand');
            dispatch(completeSceneAction(controller.questName, actorName));
            CombatController.actorMeleeEnd(actorName, intent);
          };
          setTimeout(attackComplete, 1000);
          break;
        }
        case SceneActionType.shoot: {
          determineOrientation();
          setAnimation('attack');
          CombatController.actorShootStart(actorName, intent);

          const attackComplete = () => {
            setAnimation('stand');
            dispatch(completeSceneAction(controller.questName, actorName));
            CombatController.actorShootEnd(actorName, intent);
          };
          setTimeout(attackComplete, 500);
          break;
        }
        case SceneActionType.interact: {
          controller.actorInteract(actorName, nextAction.intent.to);
          dispatch(completeSceneAction(controller.questName, actorName));
          break;
        }
      }
      previousAction.current = nextAction;
    }
  }, [actorName, actorRef, controller, dispatch, location, nextAction, quest.name, setOrientation, tileHeight, tileWidth]);

  // useEffect(() => {
  //   console.log('location CHANGE')
  //   setAnimation('stand');
  // }, [location]);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, [animation]);

  useEffect(() => {
    return () => {
      tween.current?.kill();
    };
  }, []);

  return animation;
};

export default useAnimation;

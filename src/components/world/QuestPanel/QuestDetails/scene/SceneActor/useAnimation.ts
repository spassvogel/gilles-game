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
import { Location, locationEquals } from 'utils/tilemap';
import usePrevious from 'hooks/usePrevious';
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

  const actionSelector = useCallback(() => {
    if (!quest.scene?.actionQueue) {
      return undefined;
    }
    return quest.scene.actionQueue.filter(a => (getUniqueName(a.intent.actor) === actorName))[0];
  }, [quest.scene?.actionQueue, actorName]);

  // if (!locationEquals(prevLocation ?? [0, 0], location)) {
  //   console.log('prev loc', prevLocation, 'current loc', location);
  // const moveComplete = () => {
  //   setAnimation('stand');
  //   console.log('completing an action', actorName, quest.name);
  //   dispatch(completeSceneAction(quest.name, actorName));
  //   controller.actorMoved(actorName, nextAction.intent.to);
  // };

  // const duration = (nextAction.endsAt - performance.now()) / 1000;
  // if (duration < 0) {
  //   moveComplete();
  // }

  // // determine orientation
  // determineOrientation();
  // setAnimation('walk');
  // gsap.killTweensOf(actorRef.current);
  // tween.current = gsap.to(actorRef.current, {
  //   duration,
  //   ease: 'linear',
  //   pixi: {
  //     x: nextAction.intent.to[0] * tileWidth,
  //     y: nextAction.intent.to[1] * tileHeight,
  //   },
  //   onComplete: moveComplete,
  // });
  // break;
  // }
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

  const nextAction = useSelector<StoreState, SceneAction | undefined>(actionSelector);
  const [animation, setAnimation] = useState<Animation>('stand');
  const animationTimeline = useRef<gsap.core.Timeline>();

  useEffect(() => {
    if (health <= 0) {
      setAnimation('die');
    }
  }, [health]);

  // Handle actions
  useEffect(() => {
    // Determines orientation based on where the target is
    const determineOrientation = (currentLocation: Location, target: Location) => {
      if (currentLocation[0] === target[0] && currentLocation[1] > target[1]) {
        setOrientation(Orientation.north);
      } else if (currentLocation[0] < target[0] && currentLocation[1] > target[1]) {
        setOrientation(Orientation.northEast);
      } else if (currentLocation[0] < target[0] && currentLocation[1] === target[1]) {
        setOrientation(Orientation.east);
      } else if (currentLocation[0] < target[0] && currentLocation[1] < target[1]) {
        setOrientation(Orientation.southEast);
      } else if (currentLocation[0] === target[0] && currentLocation[1] < target[1]) {
        setOrientation(Orientation.south);
      } else if (currentLocation[0] > target[0] && currentLocation[1] < target[1]) {
        setOrientation(Orientation.southWest);
      } else if (currentLocation[0] > target[0] && currentLocation[1] === target[1]) {
        setOrientation(Orientation.west);
      } else if (currentLocation[0] > target[0] && currentLocation[1] > target[1]) {
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
            console.log('completing an action', actorName, quest.name, nextAction.intent.path![nextAction.intent.path!.length - 1], nextAction.intent.to);
            dispatch(completeSceneAction(quest.name, actorName));
            controller.actorMoved(actorName, nextAction.intent.to);
          };

          const duration = (nextAction.endsAt - performance.now()) / 1000;
          if (duration < 0) {
            moveComplete();
          }

          // gsap.killTweensOf(actorRef.current);
          animationTimeline.current = gsap.timeline({
            delay: nextAction.delay,
            onComplete: moveComplete,
          });
          nextAction.intent.path?.forEach((l, index) => {
            // Queue up all the steps
            animationTimeline.current?.to(actorRef.current, {
              duration: duration / (nextAction.intent.path?.length ?? 1),
              ease: 'linear',
              pixi: {
                x: l[0] * tileWidth,
                y: l[1] * tileHeight,
              },
              onStart: () => {
                console.log('moving ', actorName, l);
                // determine orientation
                const currentLocation = nextAction.intent.path?.[index - 1] ?? location;
                determineOrientation(currentLocation, l);
                setAnimation('walk');
              },
            });
          });
          break;
        }
        case SceneActionType.melee: {
          // determineOrientation();
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
          // determineOrientation();
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
      animationTimeline.current?.kill();
    };
  }, []);

  return animation;
};

export default useAnimation;

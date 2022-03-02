import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'pixi.js';
import { gsap } from 'gsap';
import { useQuest } from 'hooks/store/quests';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import { CombatController } from 'mechanics/scenes/CombatController';
import { completeSceneAction } from 'store/actions/quests';
import { StoreState } from 'store/types';
import { SceneAction, SceneActionType } from 'store/types/scene';
import { Location } from 'utils/tilemap';
import { Orientation } from '.';

export const allAnimations = ['stand', 'attack', 'walk', 'die'] as const;
export type Animation = typeof allAnimations[number];

const useAnimation = (
  controller: BaseSceneController<unknown>,
  actorRef: RefObject<Container>,
  actorName: string,
  location: Location,
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
    return quest.scene.actionQueue.filter(a => a.actor === actorName);
  }, [quest.scene, actorName]);

  const actionQueue = useSelector<StoreState, SceneAction[]>(actionQueueSelector);
  const [animation, setAnimation] = useState<Animation>('stand');
  const tween = useRef<gsap.core.Tween>();
  const nextAction = actionQueue[0];

  useEffect(() => {
    // todo
    // const actor = quest.scene?.objects.find(o => o.name === actorName);
    // if (actor && isActorObject(actor) && actor.health <= 0) {
    //   setAnimation('die');
    // }
  }, [actorName, quest]);

  // Handle actions
  useEffect(() => {
    // Determines orientation based on where the target is
    const determineOrientation = () => {
      if (location[0] === nextAction.target[0] && location[1] > nextAction.target[1]) {
        setOrientation(Orientation.north);
      } else if (location[0] < nextAction.target[0] && location[1] > nextAction.target[1]) {
        setOrientation(Orientation.northEast);
      } else if (location[0] < nextAction.target[0] && location[1] === nextAction.target[1]) {
        setOrientation(Orientation.east);
      } else if (location[0] < nextAction.target[0] && location[1] < nextAction.target[1]) {
        setOrientation(Orientation.southEast);
      } else if (location[0] === nextAction.target[0] && location[1] < nextAction.target[1]) {
        setOrientation(Orientation.south);
      } else if (location[0] > nextAction.target[0] && location[1] < nextAction.target[1]) {
        setOrientation(Orientation.southWest);
      } else if (location[0] > nextAction.target[0] && location[1] === nextAction.target[1]) {
        setOrientation(Orientation.west);
      } else if (location[0] > nextAction.target[0] && location[1] > nextAction.target[1]) {
        setOrientation(Orientation.northWest);
      }
    };
    if (nextAction && nextAction !== previousAction.current) {
      const { intent } = nextAction;
      // console.log(`next action is ${nextAction.target} (${nextAction.actionType}), \ncurrent location is: ${location}\nprev action was ${previousAction?.current?.target} `)
      switch (nextAction.actionType) {
        case SceneActionType.move: {
          const moveComplete = () => {
            setAnimation('stand');

            dispatch(completeSceneAction(quest.name));
            controller.actorMoved(actorName, nextAction.target);
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
              x: nextAction.target[0] * tileWidth,
              y: nextAction.target[1] * tileHeight,
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
            dispatch(completeSceneAction(controller.questName));
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
            dispatch(completeSceneAction(controller.questName));
            CombatController.actorShootEnd(actorName, intent);
          };
          setTimeout(attackComplete, 500);
          break;
        }
        case SceneActionType.interact: {
          controller.actorInteract(actorName, nextAction.target);
          dispatch(completeSceneAction(controller.questName));
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

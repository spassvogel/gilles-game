
import { Container } from '@inlet/react-pixi';
import React, { useMemo,  useEffect, useRef, useCallback } from 'react';
import { SceneActionType, SceneAction } from 'stores/scene';
import { useDispatch, useSelector } from 'react-redux';
import { completeSceneAction } from 'actions/quests';
import { StoreState } from 'stores';
import { gsap } from 'gsap';

interface Props  {
    actor: string;
    tileWidth: number;
    tileHeight: number;
    questName: string;
    location?: number[]; // tile coordinate space 
    children: React.ReactNode;
};

// This is a wrapper that exposes a location property. Will set x and y on children
const SceneActor = (props: Props) => {
    const { 
        location = [0, 0],
        tileWidth = 0, 
        tileHeight = 0,
        children
    } = props;

    const actorRef = useRef<PIXI.Container>(null);
    const dispatch = useDispatch();
    
    const actionQueueSelector = useCallback(
        (state: StoreState) => {
            const quest = state.quests.find((q) => q.name === props.questName)!;
            return quest.scene.actionQueue.filter(a => a.actor === props.actor);
        }, 
        [props.actor, props.questName]
    );
    const actionQueue = useSelector<StoreState, SceneAction[]>(actionQueueSelector);

    //Handle actions 
    useEffect(() => {
        if (!actorRef) {
            return;
        }
        const nextAction = actionQueue[0];
        if (nextAction) {
            switch (nextAction.actionType) {
                case SceneActionType.move: {
                    const moveComplete = () => {
                        dispatch(completeSceneAction(props.questName));
                    }
                    const duration = (nextAction.endsAt - performance.now()) / 1000;
                    if (duration < 0) {
                        moveComplete();
                    }
                    gsap.killTweensOf(actorRef.current);
                    gsap.to(actorRef.current, {
                        duration,
                        ease: "linear",
                        pixi: {
                            x: nextAction.target[0] * tileWidth,
                            y: nextAction.target[1] * tileHeight
                        },
                        onComplete: moveComplete
                    });

                    break;
                }
            }
        }
    }, [props.questName, dispatch, tileWidth, tileHeight, actionQueue]);

    const {x, y} = useMemo(() => {
        return { 
            x: location[0] * tileWidth,
            y: location[1] * tileHeight,
        };
    }, [location, tileWidth, tileHeight]);

    return (
        <Container x={x} y={y} ref={actorRef}>
            {children}
        </Container>
    )
};

export default SceneActor;

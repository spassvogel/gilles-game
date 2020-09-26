import React, { useMemo,  useEffect, useRef, useCallback, PropsWithChildren, useState, memo } from 'react';
import { Container } from '@inlet/react-pixi';
import { SceneActionType, SceneAction } from 'stores/scene';
import { useDispatch, useSelector } from 'react-redux';
import { completeSceneAction } from 'actions/quests';
import { StoreState } from 'stores';
import { gsap } from 'gsap';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import SpriteAnimated from './SpriteAnimated';

const useIdleAnimation = false;
export interface Props  {
    name: string;
    // spritesheet: PIXI.Spritesheet;
    controller: BaseSceneController<any>;
    location?: [number, number]; // tile coordinate space
};

enum Orientation {
    north = "n",
    northEast = "ne",
    east = "e",
    southEast = "se",
    south = "s",
    southWest = "sw",
    west = "w",
    northWest = "nw"
}

// This is a wrapper that exposes a location property. Will set x and y on children
const SceneActor = (props: PropsWithChildren<Props> & React.ComponentProps<typeof Container>) => {
    const {
        location = [0, 0],
        // spritesheet,
        controller,
        children,
        ...rest
    } = props;
    const tileWidth = controller.mapData?.tilewidth!;
    const tileHeight = controller.mapData?.tileheight!;

    const actorRef = useRef<PIXI.Container>(null);
    const previousAction = useRef<SceneAction>();
    const dispatch = useDispatch();

    const actionQueueSelector = useCallback(
        (state: StoreState) => {
            const quest = state.quests.find((q) => q.name === props.controller.questName)!;
            if (!quest.scene!.actionQueue) {
                return [];
            }
            return quest.scene!.actionQueue.filter(a => a.actor === props.name);
        },
        [props.name, props.controller.questName]
    );
    const actionQueue = useSelector<StoreState, SceneAction[]>(actionQueueSelector);
    const [animation, setAnimation] = useState("stand");

    const spritesheet = useMemo(() => {
        return controller.getActorSpritesheet(props.name);
    }, [controller, props.name]);

    // Handle actions
    useEffect(() => {
        if (!actorRef) {
            return;
        }
        const nextAction = actionQueue[0];
        if (nextAction) {
            // console.log(`next action is ${nextAction.target}, \ncurrent location is: ${location.current}\nprev action was ${previousAction?.current?.target} `)
            switch (nextAction.actionType) {
                case SceneActionType.move: {
                    const moveComplete = () => {
                        dispatch(completeSceneAction(props.controller.questName));
                        props.controller.actorMoved(props.name, nextAction.target);
                    }
                    const duration = (nextAction.endsAt - performance.now()) / 1000;
                    if (duration < 0) {
                        moveComplete();
                    }

                    // determine orientation
                    if (location[0] === nextAction.target[0] && location[1] > nextAction.target[1]) {
                        setOrientation(Orientation.north);
                    }
                    else if (location[0] < nextAction.target[0] && location[1] > nextAction.target[1]) {
                        setOrientation(Orientation.northEast);
                    }
                    else if (location[0] < nextAction.target[0] && location[1] === nextAction.target[1]) {
                        setOrientation(Orientation.east);
                    }
                    else if (location[0] < nextAction.target[0] && location[1] < nextAction.target[1]) {
                        setOrientation(Orientation.southEast);
                    }
                    else if (location[0] === nextAction.target[0] && location[1] < nextAction.target[1]) {
                        setOrientation(Orientation.south);
                    }
                    else if (location[0] > nextAction.target[0] && location[1] < nextAction.target[1]) {
                        setOrientation(Orientation.southWest);
                    }
                    else if (location[0] > nextAction.target[0] && location[1] === nextAction.target[1]) {
                        setOrientation(Orientation.west);
                    }
                    else if (location[0] > nextAction.target[0] && location[1] > nextAction.target[1]) {
                        setOrientation(Orientation.northWest);
                    }
                    setAnimation("walk");
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
            previousAction.current = nextAction;
        }

    }, [dispatch, tileWidth, tileHeight, actionQueue, props.controller, props.name, location]);

    const {x, y} = useMemo(() => {
        setAnimation("stand")

        return {
            x: location[0] * tileWidth,
            y: location[1] * tileHeight,
        };
    }, [location, tileWidth, tileHeight]);

    const [frames, setFrames] = useState<{ [key: string]: PIXI.Texture[]}|null>(null);

    useEffect(() => {
        if (!spritesheet) return;

        const allFrames = Object.keys(spritesheet.textures);
        const indexed = allFrames.reduce((acc: any, frame: string) => {
            // frames are in the format of: 'stand-n', 'walk0-ne', 'walk1-ne' etc
            // create a mapping with arrays keyed by the part without the number,
            // eg: 'stand-n': [TEXTURE:stand-n] and 'walk-ne': [TEXTURE:walk0-ne, TEXTURE:walk1-ne]
            const key = frame.replace(/[0-9]/g, '');
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(PIXI.Texture.from(frame));
            return acc;
        }, {});
        setFrames(indexed);
    }, [spritesheet])

    const [orientation, setOrientation] = useState<Orientation>(Orientation.north);
    // const [flipped, setFlipped] = useState(false);
    const flipped = useRef(false);
    const setFlipped = (value:boolean) => {
        flipped.current = value;
    }

    useEffect(() => {
        setFlipped(orientation === Orientation.southWest || orientation === Orientation.west || orientation === Orientation.northWest)
    }, [orientation]);

    useEffect(() => {
        if (!useIdleAnimation) return;

        // Idle animation
        // Randomly turn left or right
        const randomOrientation = () => {
            const left = Math.random() < .5;
            if (orientation === Orientation.north && left) {
                setOrientation(Orientation.northWest);
            }
            else if (orientation === Orientation.northWest && left) {
                setOrientation(Orientation.west);
            }
            else if (orientation === Orientation.west && left) {
                setOrientation(Orientation.southWest);
            }
            else if (orientation === Orientation.southWest && left) {
                setOrientation(Orientation.south);
            }
            else if (orientation === Orientation.south && left) {
                setOrientation(Orientation.southEast);
            }
            else if (orientation === Orientation.southEast && left) {
                setOrientation(Orientation.east);
            }
            else if (orientation === Orientation.east && left) {
                setOrientation(Orientation.northEast);
            }
            else if (orientation === Orientation.northEast && left) {
                setOrientation(Orientation.north);
            }
            if (orientation === Orientation.north && !left) {
                setOrientation(Orientation.northEast);
            }
            else if (orientation === Orientation.northEast && !left) {
                setOrientation(Orientation.east);
            }
            else if (orientation === Orientation.east && !left) {
                setOrientation(Orientation.southEast);
            }
            else if (orientation === Orientation.southEast && !left) {
                setOrientation(Orientation.south);
            }
            else if (orientation === Orientation.south && !left) {
                setOrientation(Orientation.southWest);
            }
            else if (orientation === Orientation.southWest && !left) {
                setOrientation(Orientation.west);
            }
            else if (orientation === Orientation.west && !left) {
                setOrientation(Orientation.northWest);
            }
            else if (orientation === Orientation.northWest && !left) {
                setOrientation(Orientation.north);
            }
        }
        const minDuration = 2000;
        const maxDuration = 4000;
        const duration = minDuration + Math.random() * maxDuration;
        const interval = setInterval(randomOrientation, duration);
        return () => clearInterval(interval);
    }, [animation, orientation])

    const getFrames = useCallback(() => {
        const prefix = spritesheet.data.meta.image;
        switch (orientation) {
            case Orientation.northWest:
                return `${prefix}-${animation}-${Orientation.northEast}`;
            case Orientation.west:
                return `${prefix}-${animation}-${Orientation.east}`;
            case Orientation.southWest:
                return `${prefix}-${animation}-${Orientation.southEast}`;
            default:
                return `${prefix}-${animation}-${orientation}`;
        }
    }, [animation, orientation, spritesheet.data.meta.image]);

    // console.log(props.name, spritesheet, frames)
    return (
        <Container x={x} y={y} ref={actorRef} {...rest}>
            { spritesheet && frames && (
                <SpriteAnimated
                    animationSpeed={0.1}
                    name="footman"
                    isPlaying={true}
                    textures={frames[getFrames()]}
                    x={50}
                    y={30}
                    scale={[(flipped.current ? -1 : 1), 1]}
                    anchor={[.5, .5]}
                    pivot={[0, 0]}
                />
            )}
            {children}
        </Container>
    )
};

export default memo(SceneActor);

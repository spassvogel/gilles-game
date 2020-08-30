import { Container } from '@inlet/react-pixi';
import React, { useMemo,  useEffect, useRef, useCallback, PropsWithChildren, useState } from 'react';
import { SceneActionType, SceneAction } from 'stores/scene';
import { useDispatch, useSelector } from 'react-redux';
import { completeSceneAction } from 'actions/quests';
import { StoreState } from 'stores';
import { gsap } from 'gsap';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import { loadResource } from 'utils/pixiJs';
import SpriteAnimated from './SpriteAnimated';

export interface Props  {
    name: string;
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
const SceneActor = (props: PropsWithChildren<Props>) => {
    const {
        location = [0, 0],
        controller,
        children
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

                    // define orientation
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

    const [spritesheet, setSpritesheet] = useState<PIXI.Spritesheet>();
    const [frames, setFrames] = useState<{ [key: string]: PIXI.Texture[]}|null>(null);

    useEffect(() => {
        loadResource(`${process.env.PUBLIC_URL}/img/scene/actors/footman.json`, (resource) => {
            console.log('done loading for ' + props.name, resource, resource.spritesheet)
            setSpritesheet(resource.spritesheet);
        });
    }, []);

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
        switch (orientation) {
            case Orientation.northWest:
                return `${animation}-${Orientation.northEast}`;
            case Orientation.west:
                return `${animation}-${Orientation.east}`;
            case Orientation.southWest:
                return `${animation}-${Orientation.southEast}`;
            default:
                return `${animation}-${orientation}`;
        }
    }, [animation, orientation]);

    // console.log(props.name, spritesheet, frames)
    return (
        <Container x={x} y={y} ref={actorRef} name={props.name}>
            { spritesheet && frames && (
                <SpriteAnimated
                    animationSpeed={0.1}
                    name="footman"
                    isPlaying={true}
                    textures={frames[getFrames()]}
                    x={50}
                    scale={[(flipped.current ? -1 : 1), 1]}
                    anchor={[.5, .5]}
                    pivot={[0, 0]}
                />
            )}
            {children}
        </Container>
    )
};

export default SceneActor;

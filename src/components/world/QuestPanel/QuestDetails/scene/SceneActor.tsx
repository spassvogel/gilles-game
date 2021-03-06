import React, { useMemo,  useEffect, useRef, useCallback, PropsWithChildren, useState, memo } from 'react';
import { gsap } from 'gsap';
import { Container } from '@inlet/react-pixi';
import { SceneActionType, SceneAction, ActorObject } from 'store/types/scene';
import { useDispatch, useSelector } from 'react-redux';
import { completeSceneAction } from 'store/actions/quests';
import { StoreState } from 'store/types';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import SpriteAnimated from 'components/pixi/tile/SpriteAnimated';
import { Channel, MixMode, SoundManager } from 'global/SoundManager';
import { AdventurerColor } from 'store/types/adventurer';
import { useQuest } from 'hooks/store/quests';
import ActorThingy from './ActorThingy';
import { Filter, Loader, Texture, Container as PixiContainer } from 'pixi.js';
import { MultiColorReplaceFilter } from '@pixi/filter-multi-color-replace';

export interface Props  {
    actor: ActorObject;
    spritesheetPath: string;
    color?: AdventurerColor;
    controller: BaseSceneController<unknown>;
    location?: [number, number]; // tile coordinate space
    lookAt?: [number, number];
    idleAnimation?: boolean;    // Only when lookAt is undefined, will randomly turn around
}

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

const SPRITE_WIDTH = 142;

// This is a wrapper that exposes a location property. Will set x and y on children
const SceneActor = (props: PropsWithChildren<Props> & React.ComponentProps<typeof Container>) => {
    const {
        location = [0, 0],
        controller,
        idleAnimation,
        color,
        children,
        spritesheetPath,
        lookAt,
        actor,
        ...rest
    } = props;
    const { tileWidth, tileHeight } = controller.getTileDimensions();
    const actorRef = useRef<PixiContainer>(null);
    const previousAction = useRef<SceneAction>();
    const dispatch = useDispatch();
    const quest = useQuest(props.controller.questName);
    const actionQueueSelector = useCallback(() => {
        if (!quest.scene?.actionQueue) {
            return [];
        }
        return quest.scene.actionQueue.filter(a => a.actorId === actor.name);
    }, [quest.scene, actor.name]);
    
    const actionQueue = useSelector<StoreState, SceneAction[]>(actionQueueSelector);
    const [animation, setAnimation] = useState("stand");
    const tween = useRef<gsap.core.Tween>();

    // Handle actions
    useEffect(() => {
        if (!actorRef) {
            return;
        }
        // Determines orientation based on where the target is
        const determineOrientation = () => {
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
        }
        const nextAction = actionQueue[0];
        if (nextAction && nextAction !== previousAction.current) {
            // console.log(`next action is ${nextAction.target} (${nextAction.actionType}), \ncurrent location is: ${location}\nprev action was ${previousAction?.current?.target} `)
            switch (nextAction.actionType) {
                case SceneActionType.move: {
                    const moveComplete = () => {
                        dispatch(completeSceneAction(props.controller.questName));
                        props.controller.actorMoved(actor.name, nextAction.target);
                    }
                    const duration = (nextAction.endsAt - performance.now()) / 1000;
                    if (duration < 0) {
                        moveComplete();
                    }

                    // determine orientation
                    determineOrientation();
                    setAnimation("walk");
                    gsap.killTweensOf(actorRef.current);
                    tween.current = gsap.to(actorRef.current, {
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
                case SceneActionType.slash: {
                    determineOrientation();
                    setAnimation("attack");
                    SoundManager.playSound("scene/swish", Channel.scene, false, MixMode.singleInstance);
                    const attackComplete = () => {
                        setAnimation("stand");
                        dispatch(completeSceneAction(props.controller.questName));
                    }
                    setTimeout(attackComplete, 1000);
                    break;
                }
                case SceneActionType.interact: {
                    controller.actorInteract(actor.name, nextAction.target);
                    dispatch(completeSceneAction(props.controller.questName));
                    break;
                }
            }
            previousAction.current = nextAction;
        }
    }, [dispatch, tileWidth, tileHeight, actionQueue, props.controller, props.name, location, controller]);

    useEffect(() => {
        return () => {
            tween.current?.kill();
        }
    }, []);

    const {x, y} = useMemo(() => {
        setAnimation("stand")

        return {
            x: location[0] * tileWidth,
            y: location[1] * tileHeight,
        };
    }, [location, tileWidth, tileHeight]);

    const [frames, setFrames] = useState<{ [key: string]: Texture[]}|null>(null);

    useEffect(() => {
        if (!spritesheetPath) return;

        if (!Loader.shared.resources[spritesheetPath]?.textures){
            throw new Error(`No textures for ${spritesheetPath}`);
        }
        const allFrames = Object.keys(Loader.shared.resources[spritesheetPath].textures ?? {});
        const indexed = allFrames.reduce((acc: {[key: string]: Texture[] }, frame: string) => {
            // frames are in the format of: 'stand-n', 'walk0-ne', 'walk1-ne' etc
            // create a mapping with arrays keyed by the part without the number,
            // eg: 'stand-n': [TEXTURE:stand-n] and 'walk-ne': [TEXTURE:walk0-ne, TEXTURE:walk1-ne]
            const key = frame.replace(/[0-9]/g, '');
            if (!acc[key]) {
              acc[key] = [];
            }
            const texture = Loader.shared.resources[spritesheetPath].textures?.[frame];
            if (texture) acc[key].push(texture);
            return acc;
        }, {});
        setFrames(indexed);
    }, [spritesheetPath])

    const [orientation, setOrientation] = useState<Orientation>(Orientation.north);
    // const [flipped, setFlipped] = useState(false);
    const flipped = useRef(false);
    const setFlipped = (value:boolean) => {
        flipped.current = value;
    }

    useEffect(() => {
        if (lookAt !== undefined) {
            const bearing = calculateBearing(location, lookAt);
            setOrientation(bearing);
        }
    }, [location, lookAt])

    useEffect(() => {
        setFlipped(orientation === Orientation.southWest || orientation === Orientation.west || orientation === Orientation.northWest)
    }, [orientation]);

    useEffect(() => {
        // Todo: move to custom hook
        if (!idleAnimation || !!lookAt) return;

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
    }, [animation, idleAnimation, orientation, lookAt])

    const getFrames = useCallback(() => {
        const prefix = '';
        // const prefix = `${spritesheet.data.meta.image}-`;
        switch (orientation) {
            case Orientation.northWest:
                return `${prefix}${animation}-${Orientation.northEast}`;
            case Orientation.west:
                return `${prefix}${animation}-${Orientation.east}`;
            case Orientation.southWest:
                return `${prefix}${animation}-${Orientation.southEast}`;
            default:
                return `${prefix}${animation}-${orientation}`;
        }
    }, [animation, orientation]);

    const filters = useMemo<Filter[]>(() => {
        switch (color) {
            case AdventurerColor.black:
                return [createColorReplaceFilter(BLUES, BLACK)];
            case AdventurerColor.orange:
                return [createColorReplaceFilter(BLUES, ORANGE)];
            case AdventurerColor.purple:
                return [createColorReplaceFilter(BLUES, PURPLE)];
            case AdventurerColor.red:
                return [createColorReplaceFilter(BLUES, REDS)];
            case AdventurerColor.teal:
                return [createColorReplaceFilter(BLUES, TEALS)];
            case AdventurerColor.white:
                return [createColorReplaceFilter(BLUES, WHITE)];
            case AdventurerColor.yellow:
                return [createColorReplaceFilter(BLUES, YELLOW)];

            // case AdventurerColor.blue:
            default:
                return [];
        }
    }, [color])
    const showThingy = !!quest.scene?.combat;
    return (
        <Container x={x} y={y} ref={actorRef} {...rest}>
            { spritesheetPath && frames && (
                <SpriteAnimated
                    animationSpeed={0.1}
                    name="sprite"
                    isPlaying={true}
                    textures={frames[getFrames()]}
                    x={SPRITE_WIDTH/4}
                    y={20}
                    scale={[(flipped.current ? -1 : 1), 1]}
                    anchor={[.5, .5]}
                    pivot={[0, 0]}
                    filters={filters}
                    />
                )}
            {children}
            {showThingy && (
                <ActorThingy tileWidth={tileWidth} actor={actor} />
            )}
        </Container>
    )
};

export default memo(SceneActor);

// Calculates an orientation that origin would be in if it was looking at destination
const calculateBearing = (origin: [number, number], destination: [number, number]) => {
    const angle = Math.atan2(destination[1] - origin[1], destination[0] - origin[0]);
    const result = Math.round((angle / (2 * Math.PI / 8) + 8) % 8);
    const orientations = [Orientation.east, Orientation.southEast, Orientation.south, Orientation.southWest, Orientation.west, Orientation.northWest, Orientation.north, Orientation.northEast];
    return orientations[result];
}

const createColorReplaceFilter = (from: number[], to: number[]) => {
    const replacements: [number, number][] = from.map((val, index) => {
        return [
            from[index], to[index]
        ]
    });
    // todo!!
    return new MultiColorReplaceFilter(replacements, 0.15);
}

const BLUES = [
    0x000e5f,
    0x00227f,
    0x0038a5,
    0x0055cc,
];

const REDS = [
    0x570800,
    0x700c00,
    0x901000,
    0xb51700
];

const TEALS = [
    0x00330d,
    0x00653a,
    0x08936f,
    0x30bea5
];

const PURPLE = [
    0x3b0d3a,
    0x641d5e,
    0x884696,
    0xaa61bd
];

const ORANGE = [
    0x802d0c,
    0xaa4a12,
    0xd16d11,
    0xf59717
];

const BLACK = [
    0x0d0d1a,
    0x1a1b2b,
    0x25263a,
    0x35354c
];

const WHITE = [
    0x30375e,
    0x676993,
    0xa9aac2,
    0xe6e6e6
];

const YELLOW = [
    0xc28600,
    0xd6ae10,
    0xe9d333,
    0xfdf959
];
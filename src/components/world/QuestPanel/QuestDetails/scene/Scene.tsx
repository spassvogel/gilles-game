import React, { useRef, useMemo, useEffect, useContext, useCallback } from "react";
import { Container } from '@inlet/react-pixi';
import useQuest from 'hooks/store/useQuest';
import Tilemap from './Tilemap';
import { ActorObject } from 'stores/scene';
import BridgedStage from 'components/pixi/util/BridgedStage';
import SceneAdventurer from './SceneAdventurer';
import useTilesetsLoader from 'hooks/useTilesetsLoader';
import renderObject from './renderObject';
import { SceneControllerContext } from '../../context/SceneControllerContext';

import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
// eslint-disable-next-line import/first
import 'pixi-tilemap'; // tilemap is not a real npm module :/

export interface Props {
    selectedActor: string;
    setSelectedActor: (actor: string) => void;
}

const DEBUG_ACTIONQUEUE = false;

const Scene = (props: Props) => {
    const controller = useContext(SceneControllerContext)!;
    const mapData = controller.mapData!;
    const basePath = controller.basePath!;

    const {
        loadComplete,
        loadTilesets,
        tileSpritesheets
    } = useTilesetsLoader(basePath);

    const ref = useRef<PIXI.Container>(null);
    const quest = useQuest(controller.questName);
    const scene = quest.scene!;

    const selectedActor = useMemo(() => {
        return scene?.actors?.find(a => a.name === props.selectedActor) || null;
    }, [scene, props.selectedActor]);

    const renderActors = useCallback(() => {
        const renderActor = (actor: ActorObject) => {
            const {name, location} = actor;
            return (
                <SceneAdventurer
                    location={location}
                    // spritesheet={spritesheet}
                    controller={controller}
                    name={name}
                    key={name}
                    selected={selectedActor?.name === name}
                    setSelectedActor={props.setSelectedActor}
                />
            );
        }
        return scene?.actors?.map((o) => renderActor(o));

    }, [controller, props.setSelectedActor, scene, selectedActor])

    useEffect(() => {
        if (!mapData) return;
        loadTilesets(mapData.tilesets);
    }, [loadTilesets, mapData]);

    if (!loadComplete || !mapData || !scene) {
        return <div>loading...</div>
    }
    const sceneWidth = mapData.width * mapData.tilewidth;
    const sceneHeight = mapData.height * mapData.tileheight;

    return (
        <>
            <BridgedStage width={sceneWidth} height={sceneHeight}>
                <Container
                    ref={ref}
                    interactive={true}
                    hitArea={new PIXI.Rectangle(0, 0, sceneWidth, sceneHeight)}
                >
                    <Tilemap
                        basePath={basePath}
                        data={mapData}
                        spritesheets={tileSpritesheets}
                    />
                    { scene.objects.map((o) => renderObject(o, controller, tileSpritesheets ))}
                    { renderActors()}
                </Container>
            </BridgedStage>
            {DEBUG_ACTIONQUEUE && (
                <div style={{ position: 'absolute', bottom: 0}}>
                    <h2>ActionQueue</h2>
                    <ul>
                        {scene.actionQueue && scene.actionQueue.map((action) => (
                            <li key={JSON.stringify(action)}>{JSON.stringify(action)}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

export default Scene;

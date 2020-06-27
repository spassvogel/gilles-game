import React, { useRef, useMemo } from "react";
import { Container } from '@inlet/react-pixi';
import useQuest from 'hooks/store/useQuest';
import Tilemap from './Tilemap';
import { ActorObject } from 'stores/scene';
import BridgedStage from 'components/pixi/util/BridgedStage';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import SceneAdventurer from './SceneAdventurer';

import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
// eslint-disable-next-line import/first
import 'pixi-tilemap'; // tilemap is not a real npm module :/

export interface Props {
    questName: string;
    controller: BaseSceneController;
    selectedActor: string;
    setSelectedActor: (actor: string) => void;
    onLootCacheChanged: (value: string) => void; // todo: opens loot cache popup
}

const DEBUG_ACTIONQUEUE = false;

const Scene = (props: Props) => {
    const {controller} = props;
    const mapData = controller.mapData!;
    const basePath = controller.basePath!;

    const ref = useRef<PIXI.Container>(null);
    const quest = useQuest(props.questName);
    const scene = quest.scene!;

    const selectedActor = useMemo(() => {
        return scene.actors?.find(a => a.name === props.selectedActor) || null;
    }, [scene.actors, props.selectedActor]);

    const sceneWidth = mapData.width * mapData.tilewidth;
    const sceneHeight = mapData.height * mapData.tileheight;

    const renderActor = (actor: ActorObject) => {
        const {name, location} = actor;
        return (
            <SceneAdventurer
                controller={controller}
                location={location}
                name={name}
                key={name}
                questName={props.questName}
                selected={selectedActor?.name === name}
                onLootCacheChanged={props.onLootCacheChanged}
                setSelectedActor={props.setSelectedActor}
            />
        );
    }

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
                        tileObjects={scene.tileObjects}
                    />
                    { scene.actors?.map((o) => renderActor(o))}
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

import React, { useRef, useEffect, useContext, useCallback, useState } from "react";
import { Container } from '@inlet/react-pixi';
import useQuest from 'hooks/store/useQuest';
import Tilemap from './Tilemap';
import { ActorObject } from 'store/types/scene';
import BridgedStage from 'components/pixi/util/BridgedStage';
import SceneAdventurer from './SceneAdventurer';
import useTilesetsLoader from 'hooks/useTilesetsLoader';
import renderObject from './renderObject';
import { SceneControllerContext } from '../../context/SceneControllerContext';
import SceneUI, { ActionIntent } from './ui/SceneUI';
import { locationEquals } from 'utils/tilemap';
import ActionPreview from './ActionPreview';
import "./styles/scene.scss";

export interface Props {
    selectedActorId: string;
    setSelectedActor: (actor: string) => void;
}

const DEBUG_ACTIONQUEUE = false;

const Scene = (props: Props) => {
    const {selectedActorId} = props;
    const controller = useContext(SceneControllerContext)!;
    const mapData = controller.mapData!;
    const basePath = controller.basePath!;

    const {
        loadComplete,
        loadTilesets,
        tileSpritesheets
    } = useTilesetsLoader(basePath);

    const ref = useRef<HTMLDivElement>(null);
    const quest = useQuest(controller.questName);
    const {tileWidth, tileHeight} = controller.getTileDimensions();
    const scene = quest.scene!;
    const [currentActionIntent, setCurrentActionIntent] = useState<ActionIntent>();


    const renderActors = useCallback(() => {
        const renderActor = (actor: ActorObject) => {
            const {id, location} = actor;
            return (
                <SceneAdventurer
                    location={location}
                    controller={controller}
                    adventurerId={id}
                    key={id}
                    selected={props.selectedActorId === id}
                    setSelectedAdventurer={props.setSelectedActor}
                />
            );
        }
        return scene?.actors?.map((o) => renderActor(o));

    }, [controller, props.selectedActorId, props.setSelectedActor, scene?.actors])

    useEffect(() => {
        if (!mapData) return;
        loadTilesets(mapData.tilesets);
    }, [loadTilesets, mapData]);

    const handleUIMouseDown = (location: [number, number]) => {
        const actor = scene.actors.find(a => locationEquals(a.location, location));
        if (actor) {
            props.setSelectedActor(actor.id);
        }
    }

    if (!loadComplete || !mapData || !scene) {
        return <div>loading...</div>
    }

    const sceneWidth = mapData.width * mapData.tilewidth;
    const sceneHeight = mapData.height * mapData.tileheight;
    return (
        <div className="scene" ref={ref}>
            <BridgedStage width={sceneWidth} height={sceneHeight} >
                <Container
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
                    { currentActionIntent && (<ActionPreview actionIntent={currentActionIntent} tileWidth={tileWidth} tileHeight={tileHeight}/>)}
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
            <SceneUI
                sceneWidth={sceneWidth}
                sceneHeight={sceneHeight}
                selectedActorId={selectedActorId}
                actionIntent={currentActionIntent}
                onMouseDown={handleUIMouseDown}
                onSetActionIntent={setCurrentActionIntent}
            />
        </div>
    );
}

export default Scene;

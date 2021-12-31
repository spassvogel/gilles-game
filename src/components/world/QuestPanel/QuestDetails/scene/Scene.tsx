import React, { useRef, useEffect, useContext, useState } from "react";
import { Container, Graphics } from '@inlet/react-pixi';
import { useQuestScene } from 'hooks/store/quests';
import Tilemap from './Tilemap';
import BridgedStage from 'components/pixi/util/BridgedStage';
import useTilesetsLoader from 'hooks/useTilesetsLoader';
import { SceneControllerContext } from '../../context/SceneControllerContext';
import SceneUI, { ActionIntent } from './ui/SceneUI';
import ActionPreview from './ActionPreview';
import { isAdventurer } from "store/types/scene";
import SceneLog from "./SceneLog";
import { CombatController } from "mechanics/scenes/CombatController";
import { Rectangle } from "pixi.js";
import { useSettings } from "hooks/store/settings";
import "./styles/scene.scss";

export interface Props {
  selectedActorId: string;
  setSelectedActor: (id: string) => void;
}

const Scene = (props: Props) => {
  const settings = useSettings();
  const {selectedActorId, setSelectedActor } = props;
  const controller = useContext(SceneControllerContext);
  if (!controller) throw new Error("No controller found")
  const mapData = controller.mapData;
  const basePath = controller.basePath;
  if (!basePath) throw new Error("No basePath found")

  const {
    loadComplete,
    loadTilesets,
    tileSpritesheets
  } = useTilesetsLoader(basePath);

  const ref = useRef<HTMLDivElement>(null);
  const scene = useQuestScene(controller.questName);
  const combat = scene?.combat === true;
  const {tileWidth, tileHeight} = controller.getTileDimensions();
  const [currentActionIntent, setCurrentActionIntent] = useState<ActionIntent>();

  useEffect(() => {
    if (combat) {
      CombatController.initialize(controller)
    }
    return () => {
      CombatController.destroy();
    }
  }, [combat, controller]);

  useEffect(() => {
    if (!mapData) return;
    loadTilesets(mapData.tilesets);
  }, [loadTilesets, mapData]);

  const handleUIMouseDown = (location: [number, number]) => {
    const actor = controller.getObjectAtLocation(location);
    if (actor && isAdventurer(actor) && actor?.name) {
      // We can click on adventurers
      props.setSelectedActor(actor.name);
    }
  }

  if (!loadComplete || !mapData || !scene) {
    return <div>loading scene...</div>
  }

  const sceneWidth = mapData.width * mapData.tilewidth;
  const sceneHeight = mapData.height * mapData.tileheight;
  return (
    <div className="scene" ref={ref}>
      <BridgedStage width={sceneWidth} height={sceneHeight} >
        <Container
          interactive={true}
          hitArea={new Rectangle(0, 0, sceneWidth, sceneHeight)}
        >
          <Tilemap
            basePath={basePath}
            data={mapData}
            spritesheets={tileSpritesheets}
            objects={scene.objects}
            controller={controller}
            selectedActorId={selectedActorId}
            setSelectedActor={setSelectedActor}
          />
          { currentActionIntent && (<ActionPreview actionIntent={currentActionIntent} tileWidth={tileWidth} tileHeight={tileHeight}/>)}
          {settings.debugSceneShowPathable && (
            <Graphics
              name="blocked-tiles"
              draw={graphics => {
                const line = 3;
                for (let y = 0; y < mapData.height; y++) {
                  for (let x = 0; x < mapData.width; x++) {
                    const blocked = controller.locationIsBlocked([x, y]);

                    if (blocked) {
                      graphics.lineStyle(line, 0xFF0000);
                    } else {
                      graphics.lineStyle(line, 0xFFFFFF);
                    }
                    graphics.drawRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                    graphics.endFill();
                  }
                }
              }}
            />
          )}
        </Container>
      </BridgedStage>
      {settings.debugSceneShowActionQueue && (
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
      <SceneLog questId={controller.questName} />
    </div>
  );
}

export default Scene;

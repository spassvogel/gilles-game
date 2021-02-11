import React from "react";
import { Container } from "@inlet/react-pixi";
import { isActorObject, SceneObject } from "store/types/scene";
import SceneAdventurer from "./SceneAdventurer";
import { BaseSceneController } from "mechanics/scenes/BaseSceneController";
import { TiledObjectType } from "utils/tilemap";
import { Allegiance } from "store/types/combat";
import SceneActor from "./SceneActor";

interface Props {
  objects: SceneObject[];
  controller: BaseSceneController<unknown>;
  selectedActorId: string;
}

const ObjectSpriteLayer = (props: Props) => {
    const { objects, controller } = props;

    return (
        <Container>
            {objects.map((object) => {
                const { location, name } = object;
                const { adventurerId, spritesheet } = object.properties as { [key: string]: string};
                switch (object.type) {
                    case TiledObjectType.actor: {
                        if (isActorObject(object)) {
                            if (object.allegiance === Allegiance.player) {
                                return (
                                    <SceneAdventurer
                                        location={location}
                                        controller={controller}
                                        adventurerId={adventurerId}
                                        key={adventurerId}
                                        spritesheetPath={spritesheet}
                                        selected={props.selectedActorId === name }
                                    />
                                )
                            }
                            else if (object.allegiance === Allegiance.enemy) {
                                return (
                                    <SceneActor
                                        name={object.name || ""}
                                        controller={controller}
                                        spritesheetPath={spritesheet}
                                        location={location}
                                        key={object.name}
                                        idleAnimation={Math.random() < 0.5}
                                        lookAt={[4, 3]}
                                    />
                                );
                            }
                        }
                        break;
                    }
                    default:
                        return null;
                }
                return null;
            })}
        </Container>
    )
}

export default ObjectSpriteLayer;
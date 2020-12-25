import React, { useContext } from "react";
import { Container } from "@inlet/react-pixi";
import { SceneObject } from "store/types/scene";
import SceneAdventurer from "./SceneAdventurer";
import { BaseSceneController } from "mechanics/scenes/BaseSceneController";

interface Props {
  objects: SceneObject[];
  controller: BaseSceneController<any>;
  selectedActorId: string;
};

const ObjectSpriteLayer = (props: Props) => {
    const { objects, controller } = props;

    return (
        <Container>
            {objects.map((object) => {
                const { location, name } = object;
                const { adventurerId } = object.properties;
                return (
                    <SceneAdventurer
                        location={location}
                        controller={controller}
                        adventurerId={adventurerId}
                        key={adventurerId}
                        selected={props.selectedActorId === name }
                    />
                )
            })}
        </Container>
    )
}

export default ObjectSpriteLayer;
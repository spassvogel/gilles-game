import React, { useContext } from "react";
import { Container } from "@inlet/react-pixi";
import { SceneObject } from "store/types/scene";
import { SceneControllerContext } from "../../context/SceneControllerContext";
import SceneAdventurer from "./SceneAdventurer";
import { BaseSceneController } from "mechanics/scenes/BaseSceneController";
import { Props as SceneProps } from "./Scene";

interface Props extends SceneProps {
  objects: SceneObject[];
  controller: BaseSceneController<any>;
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
                        setSelectedAdventurer={props.setSelectedActor}
                    />
                )
            })}
        </Container>
    )
}

export default ObjectSpriteLayer;
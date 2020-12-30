import React from 'react';
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import { useContext } from 'react';
import { SceneActionType } from 'store/types/scene';
import "./styles/normalUICursor.scss";

interface Props {
    location: [number, number];
}

const NormalUICursor = (props: Props) => {
    const {location} = props;
    const controller = useContext(SceneControllerContext)!;

    let blocked = controller.locationIsBlocked(location);
    let action = SceneActionType.move;
    if (blocked) {
        const object = controller.getObjectAtLocation(location);
        if(!!object?.properties.interactive){
            // We're at an interactive object
            action = SceneActionType.interact;
            blocked = false;
//            console.log(controller.findPathNearest([3, 9], location))
        }
    }
    const {tileWidth, tileHeight} = controller.getTileDimensions();
    const transform = `translate(${tileWidth * location[0]}px, ${tileHeight * location[1]}px)`;
    const backgroundImage = images[action];
    const width = tileWidth;
    const height = tileHeight;
    return (
        <div
            className={`normal-ui-cursor ${blocked ? "invalid" : ""}`}
            style={{ transform, backgroundImage, width, height }}
        />
    )
}

export default NormalUICursor;

const images = {
    [SceneActionType.move]:  `url(${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/walking-boot.svg)`,
    [SceneActionType.interact]: `url(${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/sunken-eye.svg)`

}
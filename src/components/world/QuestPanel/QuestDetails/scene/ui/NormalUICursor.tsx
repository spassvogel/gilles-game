import React from 'react';
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import { useContext } from 'react';
import "./styles/normalUICursor.scss";

interface Props {
    location: [number, number];
}

const NormalUICursor = (props: Props) => {
    const {location} = props;
    const controller = useContext(SceneControllerContext)!;

    const blocked = controller.locationIsBlocked(location);
    const {tileWidth, tileHeight} = controller.getTileDimensions();
    const transform = `translate(${tileWidth * location[0]}px, ${tileHeight * location[1]}px)`;
    const backgroundImage = `url(${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/walking-boot.svg)`;
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
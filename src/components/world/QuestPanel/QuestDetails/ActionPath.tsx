import React, { useEffect, useRef } from "react";
import { Graphics, useApp } from '@inlet/react-pixi';

interface Props {
    sceneLocation: number[]; // tile coordinate space
    tileWidth: number;
    tileHeight: number;
}

/**
 * ActionPath shows a line previewing the action the user is takign on a scene
 * @param props 
 */
const ActionPath = (props: Props) => {
    const { sceneLocation, tileWidth, tileHeight } = props;
    const app = useApp();
    const graphicsRef = useRef<PIXI.Graphics>(null);

    useEffect(() => {
        const container = app.stage.children[0];
        const mouseMove = (event: PIXI.interaction.InteractionEvent) => {
            if (graphicsRef.current) {
                const grfx = graphicsRef.current;
                grfx.clear()
                    .lineStyle(3, 0xFF3300)
                    .moveTo(sceneLocation[0] * tileWidth + tileWidth / 2, 
                         sceneLocation[1] * tileHeight + tileHeight / 2)
                    .lineTo(event.data.global.x , event.data.global.y);
            }
        }
        container.on('pointermove', mouseMove);
        return () => {
            container.off('pointermove', mouseMove);
        }
    }, [app.stage, tileWidth, tileHeight, sceneLocation]);

    return (
        <Graphics
            name="ActionPath"
            ref={graphicsRef}
        />
    )

}

export default ActionPath;
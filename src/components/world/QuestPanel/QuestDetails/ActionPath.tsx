import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Graphics, useApp } from '@inlet/react-pixi';

interface Props {
    // sceneLocation: number[]; // tile coordinate space
    // actionMousePosition?: PIXI.Point;
    // tileWidth: number;
    // tileHeight: number;
    // blockedTiles: number[][];
}

export interface RefActions {
    drawAction: (from: PIXI.Point, to: PIXI.Point, allowed?: boolean) => void;
    clear: () => void;
}
/**
 * ActionPath shows a line previewing the action the user is taking on a scene
 * @param props 
 */
const ActionPath = forwardRef((props: Props, ref: React.Ref<RefActions>) => {
    const app = useApp();
    const graphicsRef = useRef<PIXI.Graphics>(null);
  
    useImperativeHandle(ref, () => ({
        drawAction: (from: PIXI.Point, to: PIXI.Point, allowed: boolean = true)=> {
            const grfx = graphicsRef.current;
            if (!grfx) return; 
            const color = allowed ? 0x00FF00 : 0xFF3300;
            grfx.clear()
                .lineStyle(3, color)
                .moveTo(from.x, from.y)
                .lineTo(to.x, to.y);
        },
        clear: () => { 
            const grfx = graphicsRef.current;
            grfx?.clear();
        }
    }));

    // useEffect(() => {
    //     const pointToSceneLocation = (point: PIXI.Point): number[] => {
    //         return [Math.floor(point.x / tileWidth ), Math.floor(point.y / tileHeight)];
    //     }

    //     const container = app.stage.children[0];
    //     // const mouseMove = (event: PIXI.interaction.InteractionEvent) => {
    //     //     if (graphicsRef.current) {
    //     //         const grfx = graphicsRef.current;
    //     //         // Find out if on a blocked tile
    //     //         const location = pointToSceneLocation(new PIXI.Point(event.data.global.x, event.data.global.y));
    //     //         const blocked = blockedTiles.some((loc) => loc[0] === location[0] && loc[1] === location[1]);
    //     //         const color = blocked ? 0xFF3300 : 0x00FF00;

    //     //         grfx.clear()
    //     //             .lineStyle(3, color)
    //     //             .moveTo(sceneLocation[0] * tileWidth + tileWidth / 2, 
    //     //                  sceneLocation[1] * tileHeight + tileHeight / 2)
    //     //             .lineTo(event.data.global.x , event.data.global.y);
    //     //     }
    //     // }
    //     // container.on('pointermove', mouseMove);
    //     // return () => {
    //     //     container.off('pointermove', mouseMove);
    //     // }
    // }, [app.stage, tileWidth, tileHeight, sceneLocation, blockedTiles]);

    return (
        <Graphics
            name="ActionPath"
            ref={graphicsRef}
        />
    )
});

export default ActionPath;


import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { Graphics } from '@inlet/react-pixi';

// tslint:disable-next-line: no-empty-interface
interface Props {

}

export interface RefActions {
    drawAction: (from: PIXI.Point, to: PIXI.Point, allowed?: boolean) => void;
    clear: () => void;
    parent: PIXI.Container;
}
/**
 * ActionPath shows a line previewing the action the user is taking on a scene
 * @param props
 */
const ActionPath = forwardRef((props: Props, ref: React.Ref<RefActions>) => {
    const graphicsRef = useRef<PIXI.Graphics>(null);

    useImperativeHandle(ref, () => {
        return {
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
            },
            parent: graphicsRef.current?.parent!
        }
    });

    return (
        <Graphics
            name="ActionPath"
            ref={graphicsRef}
        />
    )
});

export default ActionPath;


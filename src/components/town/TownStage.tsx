
import React, { useRef, useEffect, PropsWithChildren, forwardRef, useImperativeHandle } from "react";
import { Sprite, Stage } from '@inlet/react-pixi';
import { Viewport as PixiViewport} from 'pixi-viewport';
import { GodrayFilter } from 'pixi-filters';
import Viewport from 'components/pixi/Viewport';
import { gsap } from 'gsap';

export interface Props {
    screenWidth: number;
    screenHeight: number;
    worldWidth: number;
    worldHeight: number;
}


const TownStage = forwardRef<any, PropsWithChildren<Props>>((props, ref: React.Ref<PixiViewport>) => {
    const {
        children,
        screenWidth,
        screenHeight,
        worldWidth,
        worldHeight
    } = props;

    const innerRef = useRef<PixiViewport>(null);

    useImperativeHandle(ref, () => {
        return innerRef.current!
    });


    useEffect(() => {
        godray.enabled = false;
        if(innerRef.current) {

            const viewport = innerRef.current;
            viewport.on("moved", () => {
                const horizontalFactor = gsap.utils.normalize(viewport.screenWidth, worldWidth, viewport.right);
                const verticalFactor = gsap.utils.normalize(worldHeight, viewport.screenHeight, viewport.bottom);
                const factor = Math.max(horizontalFactor * verticalFactor - .4, 0);;

                godray.gain =  factor;
                godray.lacunarity = 2.4;
                godray.enabled = godray.gain > 0;
            })
        }

        const onScroll = (e: WheelEvent) => {
            // Scrolling the mouse is just used for zoom, not for actual scrolling
            e.preventDefault();
        }
        window.addEventListener("wheel", onScroll, {passive: false});
        return () => {
            window.removeEventListener("wheel", onScroll);
        };
    }, [worldHeight, worldWidth]);

    return (
        <Stage width={screenWidth} height={screenHeight} options={options} >
            <Viewport
                screenWidth={screenWidth}
                screenHeight={screenHeight}
                worldWidth={worldWidth}
                worldHeight={worldHeight}
                ref={innerRef}>
                <Sprite
                    name="background"
                    image={`${process.env.PUBLIC_URL}/img/town/town-alpha/background.png`}
                    filters={[godray]}
                >
                    {children}
                </Sprite>
            </Viewport>
        </Stage>

    )
});

export default TownStage;

const options = {
    autoDensity: true,
    sharedLoader: true
}

export const godray = new GodrayFilter();

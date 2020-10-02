
import React, { useRef, useEffect, useState, PropsWithChildren, forwardRef } from "react";
import { Sprite, Stage } from '@inlet/react-pixi';
import { Viewport as PixiViewport} from 'pixi-viewport';
import { GodrayFilter } from 'pixi-filters';
import Viewport from 'components/pixi/Viewport';

export interface Props {
    screenWidth: number;
    screenHeight: number;
    worldWidth: number;
    worldHeight: number;
}

const TownStage = forwardRef<PixiViewport, PropsWithChildren<Props>>((props, ref) => {
    const {
        children,
        screenWidth,
        screenHeight,
        worldWidth,
        worldHeight
    } = props;

    // useEffect(() => {
    //     godray.gain = 0; 
    //     setInterval(() => {
    //         godray.gain += 0.01;
    //     }, 250)
    // }, []);

    return (
        <Stage width={screenWidth} height={screenHeight} options={options} >
            <Viewport
                screenWidth={screenWidth}
                screenHeight={screenHeight}
                worldWidth={worldWidth}
                worldHeight={worldHeight}
                ref={ref}>
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
    sharedLoader: true
}

const godray = new GodrayFilter();

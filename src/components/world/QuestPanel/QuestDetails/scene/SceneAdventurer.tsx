import { Container, Graphics } from '@inlet/react-pixi';
import React, { useRef, memo } from 'react';
import SceneActor, { Props as SceneActorProps } from './SceneActor';

interface Props  {
    adventurerId: string;
    selected: boolean;
    spritesheetPath: string;
};

// The adventurers avatar on the scene
const SceneAdventurer = (props: Props & Omit<SceneActorProps, 'children'|'name'>) => {
    const {
        controller,
        location,
        adventurerId,
        selected,
        spritesheetPath,
    } = props;
    const {tileWidth, tileHeight} = controller.getTileDimensions();

    const ref = useRef<PIXI.Container>(null);

    return (
        <Container ref={ref}>
            <SceneActor
                name={adventurerId}
                controller={controller}
                spritesheetPath={spritesheetPath}
                location={location}
                idleAnimation={Math.random() < 0.5}
            >
                {selected && (
                    <Graphics
                        name="selectioncircle"
                        draw={graphics => {
                            const line = 3;
                            graphics.lineStyle(line, 0xFFFFFF);
                            graphics.drawCircle(tileWidth / 2, tileHeight / 2, tileWidth / 2 - line);
                            graphics.endFill();
                        }}
                    />
                )}
            </SceneActor>
        </Container>
    )
}

export default memo(SceneAdventurer);

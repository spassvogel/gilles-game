import { Container, Graphics, Sprite } from '@inlet/react-pixi';
import React, { useRef, memo } from 'react';
import SceneActor, { Props as SceneActorProps } from './SceneActor';
import ActionPath, { RefActions } from './ActionPath';
import ActionPoints, { RefActionPoints } from './ActionPoints';

interface Props  {
    adventurerId: string;
    selected: boolean;
};

// The adventurers avatar on the scene
const SceneAdventurer = (props: Props & Omit<SceneActorProps, 'children'|'name'>) => {
    const {
        controller,
        location,
        adventurerId,
        selected,
    } = props;
    const {tileWidth, tileHeight} = controller.getTileDimensions();

    const ref = useRef<PIXI.Container>(null);

    // Draw a line to indicate the action to take
    const actionPathRef = useRef<RefActions>(null);
    const actionPointsRef = useRef<RefActionPoints>(null);

    return (
        <Container interactive={true} ref={ref}>
            <ActionPath ref={actionPathRef} />
            <ActionPoints ref={actionPointsRef} tileWidth={tileWidth} tileHeight={tileHeight} />
            <SceneActor
                name={adventurerId}
                controller={controller}
                location={location}
                interactive={true}
                hitArea={new PIXI.Rectangle(location?.[0], location?.[1], tileWidth, tileHeight)}
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
                {/* <Sprite
                    scale={.1}
                    anchor={.5}
                    x={tileWidth / 2}
                    y={-30}
                    image={`${process.env.PUBLIC_URL}/${adventurer.avatarImg}`}
                /> */}
                { (selected && controller.actorCanInteract(adventurerId)) && (
                    <Container >
                        {/* <Graphics
                            draw={graphics => {
                                graphics.beginFill(0xDE3249);
                                graphics.drawCircle(tileWidth / 2, tileHeight, tileWidth / 4);
                                graphics.endFill();
                            }}
                        /> */}
                        <Sprite
                            image={`${process.env.PUBLIC_URL}/img/scene/ui/background.png`}
                            width={tileWidth / 2}
                            height={tileWidth / 2}
                            y={tileHeight}
                            x={tileWidth/2}
                            anchor={.5}
                        />
                        <Sprite
                            image={`${process.env.PUBLIC_URL}/img/scene/ui/interact.png`}
                            width={tileWidth / 2}
                            height={tileWidth / 2}
                            y={tileHeight}
                            x={tileWidth/2}
                            anchor={.5}
                        />
                    </Container>
                )}
            </SceneActor>
        </Container>
    )
}

export default memo(SceneAdventurer);

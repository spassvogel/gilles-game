import { Container, Graphics, Sprite } from '@inlet/react-pixi';
import React, { useRef, useEffect, memo } from 'react';
import SceneActor, { Props as SceneActorProps } from './SceneActor';
import useQuest from 'hooks/store/useQuest';
import ActionPath, { RefActions } from './ActionPath';
import { useAdventurerState } from 'hooks/store/adventurers';
import ActionPoints, { RefActionPoints } from './ActionPoints';
import useSceneAdventurerActions from 'hooks/actions/useSceneAdventurerActions';

interface Props  {
    adventurerId: string;
    selected: boolean;
    setSelectedAdventurer: (actor: string) => void;
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

    const quest = useQuest(controller.questName);

    const adventurer = useAdventurerState(adventurerId);

    // Draw a line to indicate the action to take
    const actionPathRef = useRef<RefActions>(null);
    const actionPointsRef = useRef<RefActionPoints>(null);
    const {
        adventurerStartDrag,
        adventurerEndDrag,
    } = useSceneAdventurerActions(adventurerId, controller, actionPathRef, actionPointsRef);

    const handleAdventurerStartDrag = () => {
        adventurerStartDrag();
        props.setSelectedAdventurer(adventurerId);
    }

    const handleAdventurerEndDrag = (event: PIXI.InteractionEvent) => {
        adventurerEndDrag(event);
    }

    return (
        <Container interactive={true}>
            <ActionPath ref={actionPathRef} />
            <ActionPoints ref={actionPointsRef} tileWidth={tileWidth} tileHeight={tileHeight} />
            <SceneActor
                name={adventurerId}
                controller={controller}
                location={location}
                interactive={true}
                pointerdown={handleAdventurerStartDrag}
                pointerup={handleAdventurerEndDrag}
                pointerupoutside={handleAdventurerEndDrag}
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
                    y={-80}
                    image={`${process.env.PUBLIC_URL}/img/scene/actors/wizard.png`}
                /> */}
                <Sprite
                    scale={.1}
                    anchor={.5}
                    x={tileWidth / 2}
                    y={-30}
                    image={`${process.env.PUBLIC_URL}/${adventurer.avatarImg}`}
                />
                { (selected && controller.actorCanInteract(adventurerId)) && (
                    <Container
                        interactive={true}
                        pointerdown={() => {controller.actorInteract(adventurerId)}}
                    >
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

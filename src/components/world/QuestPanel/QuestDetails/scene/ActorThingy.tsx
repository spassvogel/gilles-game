import { Container, Graphics, Text } from "@inlet/react-pixi";
import { useAdventurerState } from "hooks/store/adventurers";
import React, { useRef } from "react";
import { ActorObject } from "store/types/scene";

interface Props {
  actor: ActorObject;
  tileWidth: number;
}

const MARGIN = 4;

const ActorThingy = (props: Props) => {
    const { tileWidth, actor } = props;
    const adventurer = useAdventurerState(actor.name);
    
    const mask = useRef<PIXI.Graphics>(null);

    return (
        <Container y={-40}>
            <Text 
                y={-30}
                x={MARGIN}
                text={adventurer?.name}
                style={{
                    fontFamily : 'Gabriela', 
                    fontSize: 18, 
                    fill : 0xffffff, 
                    align : 'center',     
                    dropShadow: true,
                    dropShadowAngle: 0.9,
                    dropShadowBlur: 10,
                    dropShadowDistance: 0
                }}
                mask={mask.current}
            />
            <Graphics
                name="mask"
                ref={mask}
                draw={mask => {
                    mask.beginFill (0x003c1b);
                    mask.drawRect(MARGIN, -30, tileWidth - 2 * MARGIN, 22);
                    mask.endFill();
                }}
            />
            <Graphics
                name="background"
                draw={graphics => {
                    graphics.beginFill (0x003c1b);
                    graphics.drawRect(0, 0, tileWidth, 6);
                    graphics.endFill();
                }}
            />
            <Graphics
                name="foreground"
                draw={graphics => {
                    graphics.beginFill (0x006b22);
                    graphics.drawRect(0, 0, actor.health, 6);
                    graphics.endFill();
                }}
            />
        </Container>
    )
}

export default ActorThingy
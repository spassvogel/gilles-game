import React, { useRef, useEffect } from 'react';
import { Sprite } from '@inlet/react-pixi';
import { QuestStoreState } from 'stores/quest';
import * as PIXI from 'pixi.js';
import { AdventurerStoreState } from 'stores/adventurer';

interface Props {
    quest: QuestStoreState;
    position: PIXI.Point;
    selected?: boolean;
    onClick?: (quest: QuestStoreState) => void;
    leader: AdventurerStoreState;
}
const CIRCLE_DIAMETER = 256; // = avatar size / 2

const maskGraphics = new PIXI.Graphics();
maskGraphics.beginFill(0xBADA55);
maskGraphics.drawCircle(0, 0, CIRCLE_DIAMETER * 1);
maskGraphics.endFill(); 

const QuestMarker = (props: Props) => {
    const { quest, leader, position, onClick, selected } = props;
    const image = selected ? '/img/world/map-marker-selected.png' : '/img/world/map-marker.png';


    const avatar = useRef<Sprite>(null);
    // Mask has to be a child of the avatar in order to move with it
    useEffect(() => {
        const sprite = avatar.current as any as PIXI.Sprite;
        sprite.mask = maskGraphics;
        sprite.addChild(maskGraphics);
    }, [avatar]);

    return (
        <Sprite
            image={image} 
            name={quest.name}
            x={position.x}
            y={position.y}
            interactive={true}
            scale={new PIXI.Point(0.1, 0.1)}
            anchor={new PIXI.Point(0.5, 1)}
            pointerdown={() => {
                if(onClick) {
                    onClick(quest);
                }
            }}
        >
            { leader && (
            <Sprite 
                image={`${process.env.PUBLIC_URL}${leader.avatarImg}`} 
                name="avatar"
                anchor={new PIXI.Point(0.5, 0.5)}
                x={0}
                y={-396}
                scale={new PIXI.Point(0.66, 0.66)}
                interactive={true}
                ref={avatar}
            />)}
        </Sprite>
    )
}

export default QuestMarker;
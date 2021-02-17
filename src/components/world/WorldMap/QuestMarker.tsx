import React, { useRef, useEffect } from 'react';
import { Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import { QuestStoreState } from 'store/types/quest';
import { AdventurerStoreState } from 'store/types/adventurer';

interface Props {
    quest: QuestStoreState;
    position: PIXI.Point;
    selected?: boolean;
    encounterActive?: boolean;
    onClick?: (quest: QuestStoreState) => void;
    leader: AdventurerStoreState;
}
const CIRCLE_DIAMETER = 256; // = avatar size / 2

const QuestMarker = (props: Props) => {
    const { quest, leader, encounterActive, position, onClick, selected } = props;
    const image = selected ? '/img/world/map-marker-selected.png' : '/img/world/map-marker.png';

    const avatar = useRef<PIXI.Sprite>(null);
    // Mask has to be a child of the avatar in order to move with it
    useEffect(() => {
        const sprite = avatar.current as PIXI.Sprite;

        const maskGraphics = new PIXI.Graphics();
        maskGraphics.beginFill(0xBADA55);
        maskGraphics.drawCircle(0, 0, CIRCLE_DIAMETER * 1);
        maskGraphics.endFill();

        sprite.mask = maskGraphics;
        sprite.addChild(maskGraphics);
    }, [avatar]);

    return (
        <Sprite
            image={`${process.env.PUBLIC_URL}${image}`}
            name={quest.name}
            x={position.x}
            y={position.y}
            interactive={true}
            buttonMode={true}
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
                ref={avatar}
            />)}
            {encounterActive && (
            <Sprite
                image={`${process.env.PUBLIC_URL}/img/world/quest-alert.png`}
                name="quest-alert"
                anchor={new PIXI.Point(0.5, 1)}
                x={180}
                y={-396}
                scale={new PIXI.Point(2, 2)}
            />
            )}
        </Sprite>
    )
}

export default QuestMarker;
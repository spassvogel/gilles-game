import React, { useRef } from 'react';
import { Sprite, Graphics } from '@inlet/react-pixi';
import { QuestStoreState } from 'stores/quest';
import { Point } from 'pixi.js';
import { AdventurerStoreState } from 'stores/adventurer';

interface Props {
    quest: QuestStoreState;
    position: Point;
    onClick?: (quest: QuestStoreState) => void;
    leader: AdventurerStoreState;
}
const CIRCLE_DIAMETER = 360;

const QuestMarker = (props: Props) => {
    const { quest, leader, position, onClick } = props;
    const mask = useRef(null);
    return (
        <Sprite
            image={`${process.env.PUBLIC_URL}/img/world/map-marker.png`} 
            name={quest.name}
            x={position.x}
            y={position.y}
            interactive={true}
            scale={new Point(0.1, 0.1)}
            // scale={new Point(0.5, 0.5)}
            anchor={new Point(0.5, 1)}
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
                anchor={new Point(0.5, 0.5)}
                x={0}
                y={-396}
                scale={new Point(0.46, 0.46)}
                interactive={true}
                { ...(mask.current && { mask: mask.current})}
            >
                <Graphics
                    draw={graphics => {
                        graphics.beginFill(0xFF3300);
                        graphics.drawCircle(0, 0, CIRCLE_DIAMETER);
                        graphics.endFill(); 
                    }}
                    anchor={new Point(0.5, 0.5)}
                    x={0}
                    y={0}
                    ref={mask}
                />
            </Sprite>)}
        </Sprite>
    )
}
/* 
const graphics = new PIXI.Graphics();
graphics.beginFill(0xFF3300);
graphics.drawRect(50, 250, 100, 100);
graphics.endFill(); 
*/

export default QuestMarker;
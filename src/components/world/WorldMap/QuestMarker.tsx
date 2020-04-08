import React, { useRef, useEffect } from 'react';
import { Sprite, useApp } from '@inlet/react-pixi';
import { QuestStoreState } from 'stores/quest';
import * as PIXI from 'pixi.js';
import { AdventurerStoreState } from 'stores/adventurer';
import { cursorDefault, cursorPointer } from 'constants/cursors';
import ReactTooltip from 'react-tooltip';

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

    const avatar = useRef<Sprite>(null);
    // Mask has to be a child of the avatar in order to move with it
    useEffect(() => {
        const sprite = avatar.current as any as PIXI.Sprite;

        const maskGraphics = new PIXI.Graphics();
        maskGraphics.beginFill(0xBADA55);
        maskGraphics.drawCircle(0, 0, CIRCLE_DIAMETER * 1);
        maskGraphics.endFill(); 

        sprite.mask = maskGraphics;
        sprite.addChild(maskGraphics);

        sprite.cursor = "hover";
        sprite.interactive = true;
    }, [avatar]);

    //todo: cursors [25/07/2019 CUSTOM CURSORS]
    const pixiApp = useApp();
    if (pixiApp) {
        pixiApp.renderer.plugins.interaction.cursorStyles.default = cursorDefault;
        pixiApp.renderer.plugins.interaction.cursorStyles.hover = cursorPointer; //"url('https://i.imgur.com/IaUrttj.png'), auto;";  // use cursor: 'hover'
        
        //console.log(pixiApp.renderer.plugins.interaction.cursorStyles.hover)
        //console.log("setup pixi2")
        //ReactTooltip.rebuild();
    }

    return (
        <Sprite
            image={image} 
            name={quest.name}
            cursor="hover"
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
                image={leader.avatarImg} 
                name="avatar"
                anchor={new PIXI.Point(0.5, 0.5)}
                x={0}
                y={-396}
                scale={new PIXI.Point(0.66, 0.66)}
                ref={avatar}
            />)}
            {encounterActive && (
            <Sprite 
                image='/img/world/quest-alert.png'
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
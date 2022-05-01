import React, { useRef, useEffect } from 'react';
import { Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import { QuestStoreState } from 'store/types/quest';
import { AdventurerStoreState } from 'store/types/adventurer';
import { Point } from 'pixi.js';
import { sprites } from 'manifests/sprites';

interface Props {
  quest: QuestStoreState;
  position: Point;
  selected?: boolean;
  encounterActive?: boolean;
  onClick?: (quest: QuestStoreState) => void;
  leader: AdventurerStoreState;
}
const CIRCLE_DIAMETER = 256; // = avatar size / 2

const QuestMarker = (props: Props) => {
  const { quest, leader, encounterActive, position, onClick, selected } = props;
  const image = selected ? sprites.WORLD_MAP_MARKER_SELECTED : sprites.WORLD_MAP_MARKER;

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
      image={image}
      name={`${quest.name} marker`}
      x={position.x}
      y={position.y}
      interactive={true}
      buttonMode={true}
      scale={new Point(0.1, 0.1)}
      anchor={new Point(0.5, 1)}
      pointerdown={() => {
        if (onClick) {
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
        scale={new Point(0.66, 0.66)}
        ref={avatar}
      />)}
      {encounterActive && (
      <Sprite
        image={sprites.WORLD_MAP_QUEST_ALERT}
        name="quest-alert"
        anchor={new Point(0.5, 1)}
        x={180}
        y={-396}
        scale={new Point(2, 2)}
      />
      )}
    </Sprite>
  );
};

export default QuestMarker;

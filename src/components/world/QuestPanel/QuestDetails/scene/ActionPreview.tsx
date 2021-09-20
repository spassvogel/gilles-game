import React from 'react';
import DashedLine from 'components/pixi/DashedLine';
import { Point } from 'pixi.js';
import { SceneActionType } from 'store/types/scene';
import { ActionIntent } from './ui/SceneUI'
import { Graphics } from '@inlet/react-pixi';

export interface Props {
  actionIntent: ActionIntent;
  tileWidth: number;
  tileHeight: number;
}

const ActionPreview = (props: Props) => {
  const {actionIntent, tileWidth, tileHeight} = props;
  const convert = (p: number[]) => new Point(p[0] * (tileWidth) + (tileWidth / 2), p[1] * (tileHeight) + (tileHeight / 2));

  switch (actionIntent.action){
    case SceneActionType.move:
    case SceneActionType.interact:
    case SceneActionType.slash: {
      if (!actionIntent.path){
        return null;
      }
      const converted = [
        convert(actionIntent.from),
        ...actionIntent.path.map(p => convert(p))
      ];
      const valid = (!actionIntent.apCost) || actionIntent.apCost <= (actionIntent.actorAP || 0);

      return (
        <DashedLine
          points={converted}
          dash={10}
          gap={15}
          speed={20}
          rotation={0}
          style={{
            width: 6,
            color: valid ? 0xffffff : 0x8b0000,
            alpha: 1,
          }}
        />
      )
    }
    case SceneActionType.rangedAttack: {
      // draw arrow: https://math.stackexchange.com/questions/1314006/drawing-an-arrow
      const valid = (!actionIntent.apCost) || actionIntent.apCost <= (actionIntent.actorAP || 0);
      const from = convert(actionIntent.from);
      const to = convert(actionIntent.to);
      return (
        <Graphics
          name="line"
          draw={graphics => {
            graphics.lineStyle(4, valid ? 0xcb8c06 : 0x8b0000, 1)
            graphics.moveTo(from.x, from.y)
            graphics.lineTo(to.x, to.y);
            graphics.endFill();
          }}
        />
      )
    }
    default:
      return null;
  }
}

export default ActionPreview;

import DashedLine from 'components/pixi/DashedLine';
import { Point } from 'pixi.js';
import React from 'react';
import { SceneActionType } from 'store/types/scene';
import { ActionIntent } from './ui/SceneUI'

export interface Props {
  actionIntent: ActionIntent;
  tileWidth: number;
  tileHeight: number;
}

const ActionPreview = (props: Props) => {
  const {actionIntent, tileWidth, tileHeight} = props;

  switch (actionIntent.action){
    case SceneActionType.move:
    case SceneActionType.interact:
    case SceneActionType.slash: {
      if (!actionIntent.path){
        return null;
      }
      const convert = (p: number[]) => new Point(p[0] * (tileWidth) + (tileWidth / 2), p[1] * (tileHeight) + (tileHeight / 2));
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
        />)
    }
    default:
      return null;
  }
}

export default ActionPreview;
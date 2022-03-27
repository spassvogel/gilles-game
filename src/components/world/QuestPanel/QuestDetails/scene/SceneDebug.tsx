import { Graphics, Text } from '@inlet/react-pixi';
import { useSettings } from 'hooks/store/settings';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import { TextStyle } from 'pixi.js';
import { useMemo } from 'react';
import { Location } from 'utils/tilemap';

type Props = {
  controller: BaseSceneController<unknown>
};

const style = new TextStyle({
  fontFamily : 'Gabriela',
  fontSize: 24,
  fill: 0xffffff,
  wordWrap: true,
  wordWrapWidth: 200,
  dropShadow: true,
  dropShadowAngle: 0.9,
  dropShadowBlur: 10,
  dropShadowDistance: 0,
});

// various debug stuff for scene, can be set via settings
const SceneDebug = (props: Props) => {
  const settings = useSettings();
  const { controller } = props;
  const mapData = controller.mapData;
  const { tileWidth, tileHeight } = controller.getTileDimensions();

  const allLocations = useMemo<Location[]>(() => {
    if (!mapData) return [];
    const result = [];
    for (let y = 0; y < mapData.height; y++) {
      for (let x = 0; x < mapData.width; x++) {
        result.push([x, y] as Location);
      }
    }
    return result;
  }, [mapData]);
  if (!mapData) return null;

  return (
  <>
    {settings.debugSceneShowPathable && (
      <Graphics
        name="blocked-tiles"
        draw={graphics => {
          const line = 3;
          for (let y = 0; y < mapData.height; y++) {
            for (let x = 0; x < mapData.width; x++) {
              const blocked = controller.locationIsBlocked([x, y]);

              if (blocked) {
                graphics.lineStyle(line, 0xFF0000);
              } else {
                graphics.lineStyle(line, 0xFFFFFF);
              }
              graphics.drawRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
              graphics.endFill();
            }
          }
        }}
      />
    )}
    {settings.debugSceneShowCellLocations && (
      allLocations.map(([x, y]) => (
        <Text
          anchor={0.5}
          style={style}
          x={x * tileWidth + tileWidth / 2}
          y={y * tileHeight + tileHeight / 2}
          text={`[${x},${y}]`} key={`[${x},${y}]`}
        />
      ))
    )}
  </>
  );
};

export default SceneDebug;

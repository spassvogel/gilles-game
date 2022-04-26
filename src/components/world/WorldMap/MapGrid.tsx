import { Graphics, Point } from 'pixi.js';
import { PixiComponent } from '@inlet/react-pixi';

interface Props {
  width: number;
  height: number;
  gridWidth: number;
}

const gridColor = 0xfff; // grey
const dotColor = 0x5203fc;  // purple

// For debugging. Displays a grid
const MapGrid = PixiComponent('Rectangle', {
  create: (_props: Props) => new Graphics(),
  applyProps: (instance: Graphics, _oldProps, props) => {
    const { width, height, gridWidth } = props;

    instance.clear();
    instance.lineStyle(1, gridColor, 0.5);
    for (let y = 0; y < height; y++) {
      instance.moveTo(0, y * gridWidth);
      instance.lineTo(width, y * gridWidth);
    }

    for (let x = 0; x < width; x++) {
      instance.moveTo(x * gridWidth, 0);
      instance.lineTo(x * gridWidth, height);
    }
    instance.endFill();

    // Store props to access them in didMount
    // todo: figure out a nicer way to access props in didmount
    Object.assign(instance, {
      gridWidth,
      worldWidth: width,
      worldHeight: height,
    });
  },

  didMount: (instance: Graphics, parent) => {

    const point = new Graphics();
    point.beginFill(dotColor);
    point.drawCircle(0, 0, 3);
    point.endFill();
    point.x = -999; // offscreen
    instance.addChild(point);

    const { gridWidth/*, worldWidth, worldHeight*/ } = instance as unknown as { gridWidth: number };
    parent.addListener('clicked', (event: { world: Point }) => {
      const nearestX = Math.round(event.world.x / gridWidth) * gridWidth;
      const nearestY = Math.round(event.world.y / gridWidth) * gridWidth;

      // Move the purple dot
      point.x = nearestX;
      point.y = nearestY;
    });

    // Node locations work on a centered coordinate system
    // const toNodeLocation = (x: number, y: number) => {
    //   return {
    //     x: (x - Math.floor(worldWidth / 2)) / gridWidth,
    //     y: (y - Math.floor(worldHeight / 2)) / gridWidth,
    //   };
    // };
  },
});



export default MapGrid;

import { Graphics } from 'pixi.js';
import { PixiComponent } from '@inlet/react-pixi';

interface Props {
    width: number;
    height: number;
    gridWidth: number;
}

const MapGrid = PixiComponent('Rectangle', {
  create: (props: Props) => new Graphics(),
  applyProps: (instance: Graphics, _, props) => {
    const { width, height, gridWidth } = props;

    instance.clear();
    instance.lineStyle(1, 0xff0000, 0.5);
    for(let y = 0; y < height; y++) {
        instance.moveTo(0, y * gridWidth);
        instance.lineTo(width, y * gridWidth);
    }

    for(let x = 0; x < width; x++) {
        instance.moveTo(x * gridWidth, 0);
        instance.lineTo(x * gridWidth, height);        
    }

    instance.endFill();

    instance.interactive = true;
    instance.addListener("pointermove", (event) => {
      //console.log(event.data.global)
      //console.log(event.data.originalEvent)
    });
  },
});

export default MapGrid;
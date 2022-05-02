import { Container, Sprite, Text } from '@inlet/react-pixi';
import { Structure } from 'definitions/structures';
import { useStructureState } from 'hooks/store/structures';
import { StructureState } from 'store/types/structure';
import { TextManager } from 'global/TextManager';
import { BlurFilter } from '@pixi/filter-blur';
import StructureIconSprite from './StructureIconSprite';
import { TextStyle, TextMetrics } from 'pixi.js';
import { sprites } from 'manifests/sprites';

interface Props {
  structure: Structure;
  x: number;
  y: number;
  onStructureClick: (structure: Structure | null) => void;
}

const style = new TextStyle({
  fontFamily : 'Gabriela',
  fontSize: 25,
  fill: 0xffffff,
  wordWrap: true,
  wordWrapWidth: 200,
  dropShadow: true,
  dropShadowAngle: 0.9,
  dropShadowBlur: 10,
  dropShadowDistance: 0,
});

const blurFilter = new BlurFilter(2, 2);
const borderWidth = 985; // width of original border image

const StructureLabel = (props: Props) => {
  const { x, y, onStructureClick } = props;
  const structure = useStructureState(props.structure);
  // const mask = useRef<PIXI.Graphics>(null);
  if (structure.state !== StructureState.Built){
    return null;
  }
  const structureName = TextManager.getStructureName(props.structure) ?? '';
  const metrics = TextMetrics.measureText(`${structureName}`, style);

  const handleClick = () => {
    onStructureClick(props.structure);
  };

  return (
    <Container
      x={x}
      y={y}
      name={props.structure}
      click={handleClick}
      interactive
    >
      <Sprite
        name="background"
        image={sprites.TOWN_STRUCTURELABEL_BACKGROUND}
        scale={[(metrics.width + 16) / 190, 25.5]}
        alpha={0.5}
        filters={[blurFilter]}
        y={3.5}
        x={8}
      />
      <Sprite
        name="border-top"
        image={sprites.TOWN_STRUCTURELABEL_BORDER}
        scale={[(metrics.width + 30) / borderWidth, 0.2]}
        y={2}
      />
       <Sprite
          name="border-bottom"
          image={sprites.TOWN_STRUCTURELABEL_BORDER}
          y={28}
          scale={[(metrics.width + 30) / borderWidth, 0.2]}
       />
       <StructureIconSprite
          name="icon"
          structure={props.structure}
          y={-2}
          x={metrics.width + 12}
          scale={[0.015, 0.015]}
       />
      {/* <Graphics
        name="mask"
        ref={mask}
        draw={graphics => {
            graphics.beginFill(0xff0000)
            graphics.drawRect(-32, 6, metrics.width + 60, 32-6);
            graphics.endFill();
        }}
      /> */}
      <Text
        anchor={[0, 0]}
        text={`  ${structureName[0].toUpperCase() + structureName.slice(1)}  `}
        style={style}
      />
    </Container>
  );
};

export default StructureLabel;

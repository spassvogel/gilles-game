import { Structure } from 'definitions/structures';
import { Sprite } from '@inlet/react-pixi';
import HitAreaShapes from 'utils/pixiJs/hitAreaShapes';
import { STRUCTURE_HIGHLIGHT_FILTER } from 'components/town/TownView';
import { Point } from 'pixi.js';

export interface Props {
  onStructureClick: (structure: Structure | null) => void;
  position: Point;
  selected?: boolean;
  structure: Structure;
  hitAreaShapes: HitAreaShapes;
}

const Generic = (props: Props) => {
  const {structure, position, hitAreaShapes, selected, onStructureClick} = props;
  const filters = selected ? [STRUCTURE_HIGHLIGHT_FILTER] : [];

  const handlePointerTap = () => {
    onStructureClick(structure);
  };

  return (
    <Sprite
      name={structure}
      position={position}
      interactive={true}
      buttonMode={true}
      pointertap={handlePointerTap}
      hitArea={hitAreaShapes}
      filters={filters}
      image={`${process.env.PUBLIC_URL}/img/town/town-alpha/${structure}.png`}
    >
      {/* <Graphics
        name="hitarea"
        draw={graphics => {
          graphics.beginFill(0xffffff);
          hitAreaShapes.shapes.map(shape => graphics.drawPolygon(shape))
          graphics.endFill();
        }}
      /> */}
    </Sprite>
  );
}
export default Generic;

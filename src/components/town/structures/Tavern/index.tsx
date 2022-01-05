import { Sprite, Container } from '@inlet/react-pixi';
import { Point } from 'pixi.js';
import { Structure } from 'definitions/structures';
import HitAreaShapes from 'utils/pixiJs/hitAreaShapes';
import smoke from './smoke.json';
import ParticleEmitter from 'components/pixi/ParticleEmitter';
import { STRUCTURE_HIGHLIGHT_FILTER } from 'components/town/TownView';

export interface Props {
  onStructureClick: (structure: Structure | null) => void;
  position: Point;
  selected?: boolean;
  hitAreaShapes: HitAreaShapes;
}

const Tavern = (props: Props) => {
  const { hitAreaShapes, position } = props;
  const structure: Structure = 'tavern';
  const filters = props.selected ? [STRUCTURE_HIGHLIGHT_FILTER] : [];

  return (
    <Container position={position}>
      <Sprite
        name={structure}
        interactive={true}
        buttonMode={true}
        pointertap={() => { props.onStructureClick(structure); }}
        filters={filters}
        hitArea={hitAreaShapes}
        image={`${process.env.PUBLIC_URL}/img/town/town-alpha/${structure}.png`}
      />
      <ParticleEmitter
        name="smoke"
        x={107}
        y={-2}
        image={`${process.env.PUBLIC_URL}/img/town/effects/smokeparticle.png`}
        config={smoke}
      />
    </Container>
  );
};
export default Tavern;

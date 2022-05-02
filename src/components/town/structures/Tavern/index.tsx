import { Sprite, Container } from '@inlet/react-pixi';
import { Point } from 'pixi.js';
import { Structure } from 'definitions/structures';
import HitAreaShapes from 'utils/pixiJs/hitAreaShapes';
import smoke from './smoke.json';
import ParticleEmitter from 'components/pixi/ParticleEmitter';
import { STRUCTURE_HIGHLIGHT_FILTER } from 'components/town/TownView';
import { sprites } from 'manifests/sprites';

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
        image={sprites.TOWN_STRUCTURE_TAVERN}
      />
      <ParticleEmitter
        name="smoke"
        x={107}
        y={-2}
        image={sprites.TOWN_EFFECT_SMOKEPARTICLE}
        config={smoke}
      />
    </Container>
  );
};
export default Tavern;

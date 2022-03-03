import { EnemyObject } from 'store/types/scene';
import { getDefinition } from 'definitions/enemies';
import { EnemyType } from 'definitions/enemies/types';
import { TextManager } from 'global/TextManager';
import Attributes from 'components/ui/adventurer/AdventurerPanel/Attributes';
import CombatAttributes from './CombatAttributes';
import { generateBaseAttributes } from 'mechanics/adventurers/attributes';
import { calculateBaseHitpoints } from 'mechanics/adventurers/hitpoints';
import { formatNumber } from 'utils/format/number';

interface Props {
  actorObject: EnemyObject
}

const EnemyContext = (props: Props) => {
  const { actorObject } = props;
  const definition = getDefinition(actorObject.enemyType as EnemyType);
  const level = actorObject.level ?? 1;
  const attributesExtended = generateBaseAttributes(definition.attributes);

  return (
    <div>
      <div className="name-and-level">
        <div className="name">
          {TextManager.getEnemyName(actorObject.enemyType as EnemyType)}
        </div>
        <div className="level">
          {TextManager.get('ui-tooltip-actor-level', { level })}
        </div>
      </div>
      <div>
        <div>
          health:
        </div>
        <div>
          {formatNumber(actorObject.health, 2)}/
          {calculateBaseHitpoints(actorObject.level ?? 1, definition.attributes.for)}
        </div>
      </div>
      <Attributes attributes={attributesExtended} small />
      <CombatAttributes attributes={definition.attributes} level={level} />
    </div>
  );
};

export default EnemyContext;

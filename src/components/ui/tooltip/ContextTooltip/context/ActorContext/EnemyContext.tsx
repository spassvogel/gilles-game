import { ActorObject } from 'store/types/scene';
import { getDefinition } from 'definitions/enemies';
import { EnemyType } from 'definitions/enemies/types';
import { TextManager } from 'global/TextManager';
import Attributes from 'components/ui/adventurer/AdventurerPanel/Attributes';
import CombatAttributes from './CombatAttributes';
import { generateBaseAttributes } from 'mechanics/adventurers/attributes';

interface Props {
  actorObject: ActorObject
}

const EnemyContext = (props: Props) => {
  const { actorObject } = props;
  const definition = getDefinition(actorObject.name as EnemyType);
  const level = actorObject.level ?? 1;
  const attributesExtended = generateBaseAttributes(definition.attributes);

  return (
    <div>
      <div className="name-and-level">
        <div className="name">
          {TextManager.getEnemyName(actorObject.name as EnemyType)}
        </div>
        <div className="level">
          {TextManager.get('ui-tooltip-actor-level', { level })}
        </div>
      </div>
      <Attributes attributes={attributesExtended} small />
      <CombatAttributes attributes={definition.attributes} level={level} />
    </div>
  );
};

export default EnemyContext;

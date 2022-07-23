import { Merge } from 'type-fest';
import { TextManager } from 'global/TextManager';
import AccordionItem, { Props as AccordionItemProps } from 'components/ui/accordion/AccordionItem';
import { useEnemyActorObject, useQuest } from 'hooks/store/quests';
import { getDefinition } from 'definitions/enemies';
import { generateBaseAttributes, MAX_VALUE } from 'mechanics/adventurers/attributes';
import Attributes from 'components/ui/attributes/AttributeList';
import CombatAttributes from 'components/ui/tooltip/ContextTooltip/context/ActorContext/CombatAttributes';
import { calculateBaseHitpoints } from 'mechanics/adventurers/hitpoints';
import { PlainProgressbar } from 'components/ui/common/progress';
import { roundIfNeeded } from 'utils/format/number';
import { CSSProperties } from 'react';
import { Allegiance } from 'store/types/scene';

type Props = Merge<Omit<AccordionItemProps, 'id' | 'title'>, {
  enemyId: string;
  selected: boolean;
  questName: string;
}>;

const style = { '--item-count': MAX_VALUE } as CSSProperties;

const ActorsAccordionEnemyItem = (props: Props) => {
  const { enemyId, selected, questName, ...rest } = props;
  const actorObject = useEnemyActorObject(questName, enemyId);
  const quest = useQuest(questName);
  if (!actorObject) throw new Error(`No actor found with id ${enemyId}`);
  const definition = getDefinition(actorObject.enemyType);
  const level = actorObject.level ?? 1;
  const extendedAttributes = generateBaseAttributes(definition.attributes);
  const attributes = definition.attributes;
  const baseHP = calculateBaseHitpoints(level, attributes.for);
  const health = actorObject.health;
  const label = health > 0 ? `${roundIfNeeded(Math.max(health, 0))}/${baseHP}` : TextManager.get('ui-adventurer-info-dead');
  const apDisplay = health > 0 ? TextManager.get('ui-actor-info-ap', { ap: actorObject?.ap }) : TextManager.get('ui-actor-info-ap-dead');
  const apActive = health > 0 && quest.scene?.turn === Allegiance.enemy;

  return (
    <AccordionItem
      className={`actors-accordion-item ${selected ? 'selected' : ''}`}
      { ...rest}
      id={enemyId}
      title={(<>
        <div className={`name ${health > 0 ? '' : 'dead'}`}>{TextManager.getEnemyName(actorObject.enemyType)}</div>
        <div className={`ap ${apActive ? 'active' : ''}`}>{apDisplay}</div>
      </>)}
    >
      <div>
        <div className={'attribute-list'} style={style}>
          <div className="health">
            {TextManager.get('ui-actor-info-health')}
          </div>
          <PlainProgressbar
            progress={health / baseHP}
            label={label}
            variation="health"
          />
          <div className="level">
           {health > 0 ? TextManager.get('ui-tooltip-actor-level', { level }) : ''}
          </div>
        </div>
        <Attributes attributes={extendedAttributes} small />
        <CombatAttributes attributes={attributes} level={level} />
      </div>
    </AccordionItem>
  );
};

export default ActorsAccordionEnemyItem;

import { Merge } from 'type-fest';
import { TextManager } from 'global/TextManager';
import AccordionItem, { Props as AccordionItemProps } from 'components/ui/accordion/AccordionItem';
import { useQuestSceneObjectById } from 'hooks/store/quests';
import { ActorObject } from 'store/types/scene';
import { getDefinition } from 'definitions/enemies';
import { generateBaseAttributes } from 'mechanics/adventurers/attributes';
import Attributes from 'components/ui/adventurer/AdventurerPanel/Attributes';
import CombatAttributes from 'components/ui/tooltip/ContextTooltip/context/ActorContext/CombatAttributes';

type Props = Merge<Omit<AccordionItemProps, 'id' | 'title'>, {
  enemyId: string;
  selected: boolean;
  questName: string;
}>;

const ActorsAccordionEnemyItem = (props: Props) => {
  const { enemyId, selected, questName, ...rest } = props;
  const actorObject = useQuestSceneObjectById<ActorObject>(questName, enemyId);
  if (!actorObject) throw new Error(`No actor found with id ${enemyId}`);
  const definition = getDefinition(actorObject.name);
  const level = actorObject.level ?? 1;
  const extendedAttributes = generateBaseAttributes(definition.attributes);
  const attributes = definition.attributes;

  return (
    <AccordionItem
      className={`actors-accordion-item ${selected ? 'selected' : ''}`}
      { ...rest}
      id={enemyId}
      title={(<>
        <div className="name">{TextManager.getEnemyName(actorObject.name)}</div>
        <div className="ap">AP: 3</div>
      </>)}
    >
      <div>
        <div className="name-and-level">
          <div className="level">
            {TextManager.get('ui-tooltip-actor-level', { level })}
          </div>
        </div>
        <Attributes attributes={extendedAttributes} small />
        <CombatAttributes attributes={attributes} level={level} />
      </div>
    </AccordionItem>
  );
};

export default ActorsAccordionEnemyItem;

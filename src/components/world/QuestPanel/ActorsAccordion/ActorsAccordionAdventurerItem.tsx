import { CSSProperties, useMemo } from 'react';
import { Merge } from 'type-fest';
import { useAdventurer } from 'hooks/store/adventurers';
import Attributes from 'components/ui/attributes/AttributeList';
import { xpToLevel } from 'mechanics/adventurers/levels';
import { TextManager } from 'global/TextManager';
import { calculateEffectiveAttributes, calculateEffectiveAttributesExtended, MAX_VALUE } from 'mechanics/adventurers/attributes';
import AccordionItem, { Props as AccordionItemProps } from 'components/ui/accordion/AccordionItem';
import CombatAttributes from 'components/ui/tooltip/ContextTooltip/context/ActorContext/CombatAttributes';
import { useAdventurerActorObject } from 'hooks/store/quests';
import { PlainProgressbar } from 'components/ui/common/progress';
import { calculateBaseHitpoints } from 'mechanics/adventurers/hitpoints';
import { roundIfNeeded } from 'utils/format/number';

type Props = Merge<Omit<AccordionItemProps, 'id' | 'title'>, {
  adventurerId: string
  selected: boolean
  questName: string;
}>;
const style = { '--item-count': MAX_VALUE } as CSSProperties;

const ActorsAccordionAdventurerItem = (props: Props) => {
  const { adventurerId, selected, questName, ...rest } = props;
  const adventurer = useAdventurer(adventurerId);
  const attributes = calculateEffectiveAttributes(adventurer);
  const { xp } = adventurer;
  const level = xpToLevel(xp);
  const extendedAttributes = useMemo(() => calculateEffectiveAttributesExtended(adventurer), [adventurer]);
  const actor = useAdventurerActorObject(questName ?? '', adventurerId);
  const baseHP = calculateBaseHitpoints(level, attributes.for);
  const health = adventurer.health;
  const label = health > 0 ? `${roundIfNeeded(Math.max(health, 0))}/${baseHP}` : TextManager.get('ui-adventurer-info-dead');

  return (
    <AccordionItem
      className={`actors-accordion-item ${selected ? 'selected' : ''}`}
      { ...rest}
      id={adventurerId}
      title={(<>
        <div className="name">{TextManager.getAdventurerName(adventurerId)}</div>
        <div className="ap">AP: {actor?.ap}</div>
      </>)}
    >
      <div>
       <div className={'attribute-list'} style={style}>
          <div className="health">
            {TextManager.get('ui-adventurer-info-health')}
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

export default ActorsAccordionAdventurerItem;

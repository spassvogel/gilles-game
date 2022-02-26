import { useMemo } from 'react';
import { Merge } from 'type-fest';
import { useAdventurer } from 'hooks/store/adventurers';
import Attributes from 'components/ui/adventurer/AdventurerPanel/Attributes';
import { xpToLevel } from 'mechanics/adventurers/levels';
import { TextManager } from 'global/TextManager';
import { calculateEffectiveAttributes, calculateEffectiveAttributesExtended } from 'mechanics/adventurers/attributes';
import AccordionItem, { Props as AccordionItemProps } from 'components/ui/accordion/AccordionItem';
import CombatAttributes from 'components/ui/tooltip/ContextTooltip/context/ActorContext/CombatAttributes';
import { useActorObject } from 'hooks/store/quests';
import { ActorObject } from 'store/types/scene';

type Props = Merge<Omit<AccordionItemProps, 'id' | 'title'>, {
  adventurerId: string
  selected: boolean
  questName: string;
}>;

const ActorsAccordionAdventurerItem = (props: Props) => {
  const { adventurerId, selected, questName, ...rest } = props;
  const adventurer = useAdventurer(adventurerId);
  const attributes = calculateEffectiveAttributes(adventurer);
  const { name, xp } = adventurer;
  const level = xpToLevel(xp);
  const extendedAttributes = useMemo(() => calculateEffectiveAttributesExtended(adventurer), [adventurer]);
  const actor = useActorObject<ActorObject>(questName ?? '', adventurerId);

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

export default ActorsAccordionAdventurerItem;

import { AdventurerStoreState } from 'store/types/adventurer';
import Accordion from 'components/ui/accordion/Accordion';
import ActorsAccordionAdventurerItem from './ActorsAccordionAdventurerItem';
import './styles/actorsAccordion.scss';

type Props = {
  selectedActorId: string;
  adventurers: AdventurerStoreState[];
  onActorSelected: (actorId: string) => void;
  questName: string;
};

// A tabstrip with adventurer details below it
const ActorsAccordion = (props: Props) => {
  const {  adventurers, selectedActorId, questName, onActorSelected } = props;
  return (
    <Accordion className="actors-accordion">
      {adventurers.map(a => (
        <ActorsAccordionAdventurerItem
          selected={selectedActorId === a.id}
          key={a.id}
          adventurerId={a.id}
          questName={questName}
          onHeaderClick={() => { onActorSelected(a.id);}}
        />
      ))}
    </Accordion>
  );
};

export default ActorsAccordion;

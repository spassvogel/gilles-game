import Accordion from 'components/ui/accordion/Accordion';
import ActorsAccordionAdventurerItem from './ActorsAccordionAdventurerItem';
import { createSelectAdventurersOnQuest } from 'store/selectors/adventurers';
import { useSelector } from 'react-redux';
import ActorsAccordionEnemyItem from './ActorsAccordionEnemyItem';
import { useQuestSceneEnemies } from 'hooks/store/quests';
import './styles/actorsAccordion.scss';

type Props = {
  selectedActorId: string;
  onActorSelected: (actorId: string) => void;
  questName: string;
};

// A tabstrip with adventurer details below it
const ActorsAccordion = (props: Props) => {
  const { selectedActorId, questName, onActorSelected } = props;
  const adventurers = useSelector(createSelectAdventurersOnQuest(questName));
  const enemies = useQuestSceneEnemies(questName);

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
      {enemies.map(e => (
        <ActorsAccordionEnemyItem
          enemyId={e.enemyId}
          key={e.id}
          selected={selectedActorId === e.id}
          questName={questName}
        />
      ))}
    </Accordion>
  );
};

export default ActorsAccordion;

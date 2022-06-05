import Accordion from 'components/ui/accordion/Accordion';
import ActorsAccordionAdventurerItem from './ActorsAccordionAdventurerItem';
import ActorsAccordionEnemyItem from './ActorsAccordionEnemyItem';
import { useQuestSceneEnemies } from 'hooks/store/quests';
import { useAdventurersOnQuest } from 'hooks/store/adventurers';
import './styles/actorsAccordion.scss';

type Props = {
  selectedActorId: string;
  onActorSelected: (actorId: string) => void;
  questName: string;
};

// A tabstrip with adventurer / enemy details below it
const ActorsAccordion = (props: Props) => {
  const { selectedActorId, questName, onActorSelected } = props;
  const adventurers = useAdventurersOnQuest(questName);
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
          selected={selectedActorId === e.enemyId}
          onHeaderClick={() => { onActorSelected(e.enemyId);}}
          questName={questName}
        />
      ))}
    </Accordion>
  );
};

export default ActorsAccordion;

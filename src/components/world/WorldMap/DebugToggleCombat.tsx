import { useDispatch } from 'react-redux';
// import MapGrid from './MapGrid';
import { useQuest } from 'hooks/store/quests';
import { setCombat } from 'store/actions/quests';
import { Allegiance } from 'store/types/scene';

// temporary
export const DebugToggleCombat = ({ questName }: { questName: string }) => {
  const quest = useQuest(questName);
  const dispatch = useDispatch();

  if (quest.scene?.combat && quest.scene.turn !== undefined) {
    return (
      <button onClick={() => dispatch(setCombat(questName, false))}>
        combat: on ({Allegiance[quest.scene.turn]})
      </button>
    );
  }
  return (
    <button onClick={() => dispatch(setCombat(questName, true))}>
      combat: off
    </button>
  );
};

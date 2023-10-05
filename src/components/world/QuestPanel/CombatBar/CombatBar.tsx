import { useContext } from 'react';
import { SceneControllerContext } from '../context/SceneControllerContext';
import { TextManager } from 'global/TextManager';
import Button from 'components/ui/buttons/Button';
import { useQuest } from 'hooks/store/quests';
import { Allegiance } from 'store/types/scene';
import './styles/combatBar.scss';

type Props = {
  questName: string;
  selectedAdventurerId?: string;
};

const CombatBar = (props: Props) => {
  const { questName } = props;
  const controller = useContext(SceneControllerContext);
  const quest = useQuest(questName);

  return (
    <div className="combat-bar">
      <div className="title">
        {TextManager.get(`ui-combat-bar-${Allegiance[quest.scene?.turn ?? Allegiance.player]}-turn`)}
      </div>
      <Button size="medium" onClick={() => controller?.endTurn()} disabled={quest.scene?.turn !== Allegiance.player}>End turn</Button>
    </div>
  );
};

export default CombatBar;

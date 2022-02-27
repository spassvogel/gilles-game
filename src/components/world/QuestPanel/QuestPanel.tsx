import { useState, useEffect } from 'react';
import { createSelectAdventurersOnQuest } from 'store/selectors/adventurers';
import { useSelector, useDispatch } from 'react-redux';
import QuestDetails from './QuestDetails';
import { useHistory } from 'react-router';
import { getWorldLink } from 'utils/routing';
import LootCache from './modals/LootCache';
import { useQuest } from 'hooks/store/quests';
import { setActiveSceneInteractionModal } from 'store/actions/quests';
import Situation from './modals/Situation';
import SceneControllerContextProvider from './context/SceneControllerContext';
import CombatBar from './CombatBar';
import AdventurersPanel from './AdventurersPanel';
import ActorsAccordion from './ActorsAccordion';
import './styles/questPanel.scss';

enum Layout {
  auto,     // horizontal on large screens, vertical on small screens
  vertical,
  horizontal,
}

interface Props {
  questName: string;
  layout?: Layout;
}

const QuestPanel = (props: Props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { layout = Layout.auto, questName } = props;
  const adventurers = useSelector(createSelectAdventurersOnQuest(questName));
  const leader = adventurers[0];
  const [selectedActorId, setSelectedActorId] = useState<string>(leader?.id);

  const quest = useQuest(questName);
  const activeInteractionModal = quest?.scene?.activeInteractionModal;

  const handleActorSelected = (actorId: string) => {
    setSelectedActorId(actorId);
  };

  const handleCloseLootCacheModal = () => {
    dispatch(setActiveSceneInteractionModal(questName));
  };

  useEffect(() => {
    if (!adventurers.length) {
      // no adventurers, something went wrong, perhaps invalid url
      // bounce back to world
      history.push(getWorldLink());
    }
  }, [adventurers.length, history]);
  if (!adventurers.length) return null;

  return (
    <SceneControllerContextProvider questName={questName}>
      { quest?.scene?.combat && <CombatBar questName={questName} selectedAdventurerId={selectedActorId}/>}
        <div className={`quest-panel quest-panel-${Layout[layout]}`}>
          <div className="quest-area">
            <QuestDetails
              questName={questName}
              selectedActorId={selectedActorId}
              setSelectedActor={handleActorSelected}
            />
            { activeInteractionModal && activeInteractionModal.type === 'lootCache' && (
              <div className="modal" onClick={handleCloseLootCacheModal}>
                <LootCache
                  cacheName={activeInteractionModal.lootCache}
                  adventurerId={selectedActorId}
                  onClose={handleCloseLootCacheModal}
                />
              </div>
            )}
            { activeInteractionModal && activeInteractionModal.type === 'situation' && (
              <div className="modal" onClick={handleCloseLootCacheModal}>
                <Situation
                  situation={activeInteractionModal.situation}
                  adventurerId={selectedActorId}
                  onClose={handleCloseLootCacheModal}
                />
              </div>
            )}
          </div>
          <div className="party-area">
          { !quest?.scene?.combat && (
            <AdventurersPanel
              adventurers={adventurers}
              adventurerId={selectedActorId}
              onAdventurerTabSelected={handleActorSelected}
              disabled={activeInteractionModal !== undefined}
              questName={questName}
            />
          )}
          { quest?.scene?.combat && (
            <ActorsAccordion
              selectedActorId={selectedActorId}
              adventurers={adventurers}
              questName={questName}
              onActorSelected={handleActorSelected}
            />
          )}
          </div>
        </div>
    </SceneControllerContextProvider>
  );
};

export default QuestPanel;

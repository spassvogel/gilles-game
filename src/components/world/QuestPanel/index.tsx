import React, { useState, useEffect } from "react";
import AdventurerTabstrip from './AdventurerTabstrip';
import { createSelectAdventurersOnQuest } from 'store/selectors/adventurers';
import { useSelector, useDispatch } from 'react-redux';
import QuestDetails from './QuestDetails';
import { useHistory } from 'react-router';
import { getWorldLink } from 'utils/routing';
import LootCache from './modals/LootCache';
import useQuest from 'hooks/store/useQuest';
import { setActiveSceneInteractionModal } from 'store/actions/quests';
import Situation from './modals/Situation';
import SceneControllerContextProvider from './context/SceneControllerContext';
import CombatBar from './CombatBar';
import AdventurerPanel from 'components/ui/adventurer/AdventurerPanel';
import "./styles/questPanel.scss";

enum Layout {
    auto,       // horizontal on large screens, vertical on small screens
    vertical,
    horizontal
}

interface Props {
    questName: string;
    layout?: Layout;
}

const QuestPanel = (props: Props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const {layout = Layout.auto} = props;
    const adventurers = useSelector(createSelectAdventurersOnQuest(props.questName));
    const leader = adventurers[0];
    const [selectedAdventurerId, setSelectedAdventurerID] = useState<string>(leader?.id);

    const quest = useQuest(props.questName);
    const activeInteractionModal = quest?.scene?.activeInteractionModal;

    const handleAdventurerSelected = (adventurerId: string) => {
        setSelectedAdventurerID(adventurerId);
    }

    const handleCloseLootCacheModal = () => {
        dispatch(setActiveSceneInteractionModal(props.questName));
    }

    useEffect(() => {
        if (!adventurers.length) {
            // no adventurers, something went wrong, perhaps invalid url
            // bounce back to world
            history.push(getWorldLink());
       }
    }, [adventurers.length, history]);
    if (!adventurers.length) return null;

    return (
        <SceneControllerContextProvider questName={props.questName}>
            { quest?.scene?.combat && <CombatBar questName={props.questName} selectedAdventurerId={selectedAdventurerId}/>}
            <div className={`quest-panel quest-panel-${Layout[layout]}`}>
                <div className="quest-area">
                    <QuestDetails
                        questName={props.questName}
                        selectedActorId={selectedAdventurerId}
                        setSelectedActor={handleAdventurerSelected}
                    />
                    { activeInteractionModal && activeInteractionModal.type === 'lootCache' && (
                        <div className="modal" onClick={handleCloseLootCacheModal}>
                            <LootCache
                                cacheName={activeInteractionModal.lootCache}
                                adventurerId={selectedAdventurerId}
                                onClose={handleCloseLootCacheModal}
                            />
                        </div>
                    )}
                    { activeInteractionModal && activeInteractionModal.type === 'situation' && (
                        <div className="modal" onClick={handleCloseLootCacheModal}>
                            <Situation
                                situation={activeInteractionModal.situation}
                                adventurerId={selectedAdventurerId}
                                onClose={handleCloseLootCacheModal}
                            />
                        </div>
                    )}
                </div>
                <div className="party-area">
                    <AdventurerTabstrip
                        adventurers={adventurers}
                        selectedAdventurerId={selectedAdventurerId}
                        onAdventurerTabSelected={handleAdventurerSelected}
                        disabled={activeInteractionModal !== undefined}
                    />
                    <div className="adventurer-details">
                        { selectedAdventurerId && (
                            <AdventurerPanel
                                adventurerId={selectedAdventurerId}
                                questName={props.questName}
                            />
                        )}
                    </div>
                </div>
            </div>
        </SceneControllerContextProvider>
    )
}

export default QuestPanel;

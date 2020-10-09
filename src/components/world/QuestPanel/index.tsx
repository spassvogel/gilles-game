import React, { useState, useMemo, useEffect } from "react";
import AdventurerTabstrip from './AdventurerTabstrip';
import { createSelectAdventurersOnQuest } from 'selectors/adventurers';
import { useSelector, useDispatch } from 'react-redux';
import AdventurerPanel from './AdventurerPanel';
import QuestDetails from './QuestDetails';
import { useHistory } from 'react-router';
import { getWorldLink } from 'utils/routing';
import LootCache from './modals/LootCache';
import useQuest from 'hooks/store/useQuest';
import { setActiveSceneInteractionModal } from 'actions/quests';
import Situation from './modals/Situation';
import SceneControllerContextProvider from './context/SceneControllerContext';
import "./styles/questPanel.scss";
import CombatBar from './CombatBar';

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

    const selectedAdventurer = useMemo(() => {
        return adventurers.find(a => a.id === selectedAdventurerId);
    }, [adventurers, selectedAdventurerId]);

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
            <CombatBar questName={props.questName} />
            <div className={`quest-panel quest-panel-${Layout[layout]}`}>
                <div className="quest-area">
                    <QuestDetails
                        questName={props.questName}
                        selectedActor={selectedAdventurerId}
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
                        { selectedAdventurer && (
                            <AdventurerPanel adventurer={selectedAdventurer} />
                        )}
                    </div>
                </div>
            </div>
        </SceneControllerContextProvider>
    )
}

export default QuestPanel;

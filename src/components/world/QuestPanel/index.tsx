import React, { useState, useMemo, useEffect } from "react";
import "./css/questPanel.css";
import AdventurerTabstrip from './AdventurerTabstrip';
import { createSelectAdventurersOnQuest } from 'selectors/adventurers';
import { useSelector, useDispatch } from 'react-redux';
import AdventurerPanel from './AdventurerPanel';
import QuestDetails from './QuestDetails';
import { useHistory } from 'react-router';
import { getWorldLink } from 'utils/routing';
import LootCache from './modals/LootCache';
import useQuest from 'hooks/store/useQuest';
import { setActiveLootCache } from 'actions/quests';

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
    const activeLootCache = quest?.scene?.activeLootCache;

    const handleAdventurerSelected = (adventurerId: string) => {
        setSelectedAdventurerID(adventurerId);
    }

    const handleCloseLootCacheModal = () => {
        dispatch(setActiveLootCache(props.questName));
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
        <div className={`quest-panel quest-panel-${Layout[layout]}`}>
            <div className="quest-area">
                <QuestDetails
                    questName={props.questName}
                    selectedActor={selectedAdventurerId}
                    setSelectedActor={handleAdventurerSelected}
                />
                { activeLootCache && (
                    <div className="modal" onClick={handleCloseLootCacheModal}>
                        <LootCache
                            questName={props.questName}
                            cacheName={activeLootCache}
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
                    disabled={activeLootCache !== undefined}
                />
                <div className="adventurer-details">
                    { selectedAdventurer && (
                        <AdventurerPanel adventurer={selectedAdventurer} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default QuestPanel;

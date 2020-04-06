import React, { useState, useMemo } from "react";
import "./css/questPanel.css";
import AdventurerTabstrip from './AdventurerTabstrip';
import { QuestStoreState } from 'stores/quest';
import { createSelectAdventurersOnQuest } from 'selectors/adventurers';
import { useSelector } from 'react-redux';
import { AdventurerStoreState } from 'stores/adventurer';
import AdventurerPanel from './AdventurerPanel';

interface Props {
    quest: QuestStoreState;
}

const QuestPanel = (props: Props) => {
    
    const adventurers = useSelector(createSelectAdventurersOnQuest(props.quest.name));   
    const [selectedAdventurerID, setSelectedAdventurerID] = useState<string>();

    const selectedAdventurer = useMemo(() => {
        return adventurers.find(a => a.id === selectedAdventurerID);
    }, [adventurers, selectedAdventurerID]);

    const handleAdventurerSelected = (adventurer: AdventurerStoreState) => {
        setSelectedAdventurerID(adventurer.id);
    }
    
    //console.log('rendering questpanel' + JSON.stringify(selectedAdventurer?.equipment))
    return (
        <div className="quest-panel">
            <div className="quest-area">

            </div>
            <div className="party-area">
                <AdventurerTabstrip adventurers={adventurers} onAdventurerTabSelected={handleAdventurerSelected} />
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
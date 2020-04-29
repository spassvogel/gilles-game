import React, { useState, useMemo } from "react";
import "./css/questPanel.css";
import AdventurerTabstrip from './AdventurerTabstrip';
import { createSelectAdventurersOnQuest } from 'selectors/adventurers';
import { useSelector } from 'react-redux';
import AdventurerPanel from './AdventurerPanel';
import QuestDetails from './QuestDetails';

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
    const {layout = Layout.auto} = props;
    const adventurers = useSelector(createSelectAdventurersOnQuest(props.questName));   
    const leader = adventurers[0];
    const [selectedAdventurerId, setSelectedAdventurerID] = useState<string>(leader.id);

    const selectedAdventurer = useMemo(() => {
        return adventurers.find(a => a.id === selectedAdventurerId);
    }, [adventurers, selectedAdventurerId]);

    const handleAdventurerSelected = (adventurerId: string) => {
        setSelectedAdventurerID(adventurerId);
    }
    
    //console.log('rendering questpanel' + JSON.stringify(selectedAdventurer?.equipment))
    
    return (
        <div className={`quest-panel quest-panel-${Layout[layout]}`}>
            <div className="quest-area">
                <QuestDetails 
                    questName={props.questName} 
                    selectedActor={selectedAdventurerId} 
                    jsonPath={`${process.env.PUBLIC_URL}/scenes/ork-dungeon-level1.json`} 
                    setSelectedActor={handleAdventurerSelected}
                />
            </div>
            <div className="party-area">
                <AdventurerTabstrip 
                    adventurers={adventurers} 
                    selectedAdventurerId={selectedAdventurerId}
                    onAdventurerTabSelected={handleAdventurerSelected} 
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

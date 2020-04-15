import React, { useState, useMemo } from "react";
import "./css/questPanel.css";
import AdventurerTabstrip from './AdventurerTabstrip';
import { createSelectAdventurersOnQuest } from 'selectors/adventurers';
import { useSelector } from 'react-redux';
import { AdventurerStoreState } from 'stores/adventurer';
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
    const [selectedAdventurerID, setSelectedAdventurerID] = useState<string>(leader.id);

    const selectedAdventurer = useMemo(() => {
        return adventurers.find(a => a.id === selectedAdventurerID);
    }, [adventurers, selectedAdventurerID]);

    const handleAdventurerSelected = (adventurer: AdventurerStoreState) => {
        setSelectedAdventurerID(adventurer.id);
    }
    
    //console.log('rendering questpanel' + JSON.stringify(selectedAdventurer?.equipment))
    
    return (
        <div className={`quest-panel quest-panel-${Layout[layout]}`}>
            <div className="quest-area">
                <QuestDetails questName={props.questName} />
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

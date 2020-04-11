import React from "react";
import Tabstrip from 'components/ui/tabs/Tabstrip';
import { AdventurerStoreState } from 'stores/adventurer';
import Tab from 'components/ui/tabs/Tab';
import AdventurerAvatar from 'components/ui/AdventurerAvatar';

interface Props {
    adventurers: AdventurerStoreState[];
    onAdventurerTabSelected: (adventurer: AdventurerStoreState) => void;
}

// Shows adventurer portraits in a tabstrip
const AdventurerTabstrip = (props: Props) => {
    const {adventurers, onAdventurerTabSelected} = props;

    const handleAdventurerTabSelected = (adventurerId: string) => {
        const adventurer = props.adventurers.find(a => a.id === adventurerId)!;
        onAdventurerTabSelected(adventurer);
    }

    const renderAdventurerTab = (adventurer: AdventurerStoreState) => (
        <Tab id={adventurer.id} key={adventurer.id}>
            <AdventurerAvatar adventurer={adventurer} className="common-icon-small"/>
        </Tab>
    );
    return (
        <Tabstrip className="adventurers-tabstrip" onTabSelected={handleAdventurerTabSelected} >
            {adventurers.map((a) => renderAdventurerTab(a))}
        </Tabstrip>
    )
}

export default AdventurerTabstrip;
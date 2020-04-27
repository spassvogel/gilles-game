import React from 'react';
import Scene from 'components/world/QuestPanel/QuestDetails/Scene';

interface Props {
    questName: string;
}

const QuestDetails = (props: Props) => {
    // todo: see QuestDetails.old on how to access quest data

    
       //     {/* <h1 className="app-h2">{TextManager.getQuestTitle(quest.name)}</h1> */}
    return (
        <Scene jsonPath={`${process.env.PUBLIC_URL}/scenes/ork-dungeon-level1.json`} questName={props.questName} />
    )
}

export default QuestDetails;

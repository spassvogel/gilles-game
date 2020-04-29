import React from 'react';
import Scene, { Props } from 'components/world/QuestPanel/QuestDetails/Scene';



const QuestDetails = (props: Props) => {
    // todo: see QuestDetails.old on how to access quest data
    // todo: delete this
    
       //     {/* <h1 className="app-h2">{TextManager.getQuestTitle(quest.name)}</h1> */}
    return (
        <Scene {...props}/>
    )
}

export default QuestDetails;

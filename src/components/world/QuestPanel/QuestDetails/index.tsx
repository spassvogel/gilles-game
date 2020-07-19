import React from 'react';
import Scene from 'components/world/QuestPanel/QuestDetails/scene/Scene';
import useQuest from 'hooks/store/useQuest';
import OnTheRoad from './OnTheRoad';

export interface Props {
    questName: string;
    selectedActor: string;
    setSelectedActor: (actor: string) => void;
}

const QuestDetails = (props: Props) => {

    const quest = useQuest(props.questName);

    if (!quest.sceneName) {
        return <OnTheRoad questName={props.questName} />;
    }

    return (
        <Scene {...props} />
    );
}

export default QuestDetails;
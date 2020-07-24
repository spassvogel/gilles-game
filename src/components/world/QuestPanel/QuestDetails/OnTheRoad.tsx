import React from 'react';
import useQuest from 'hooks/store/useQuest';
import { getDefinition } from 'definitions/quests';
import { QuestDefinition } from 'definitions/quests/types';
import { TextManager } from 'global/TextManager';

export interface Props {
    questName: string;
}

/* Shows the most recent log on a questnode */
const OnTheRoad = (props: Props) => {
    const quest = useQuest(props.questName);
    const questDefinition: QuestDefinition = getDefinition(quest.name);
    let progress: number = Math.floor(quest.progress);
    do {
        const log = questDefinition.nodes[progress].log;
        if (log) {
            return (
                <div>
                    <p>{`${TextManager.get(log)}`}</p>
                </div>
            )
        }
        progress--;
    } while (progress >= 0);
    return <h1 className="app-h2">{TextManager.getQuestTitle(quest.name)}</h1>;
}

export default OnTheRoad;
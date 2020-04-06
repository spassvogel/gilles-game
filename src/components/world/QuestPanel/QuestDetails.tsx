import React from 'react';
import { QuestStoreState } from 'stores/quest';
import { TextManager } from 'utils/textManager';
import { getDefinition as getEncounterDefinition } from "definitions/encounters";
import { getDefinition as getQuestDefinition, QuestDefinition, QuestNode, QuestNodeType } from "definitions/quests";
import { EncounterDefinition } from 'definitions/encounters/types';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from 'stores';
import { selectQuestLogEntries } from 'selectors/quests';
import { TextEntry } from 'constants/text';
import { updateEncounterResult, advanceQuest } from 'actions/quests';

interface Props {
    quest: QuestStoreState;
}

const QuestDetails = (props: Props) => {
    const { quest } = props;

    const dispatch = useDispatch();
    const log = useSelector<StoreState, TextEntry[] | undefined>((store: StoreState) => {
        return selectQuestLogEntries(store, quest.name);
    });
    const questDefinition: QuestDefinition = getQuestDefinition(quest.name);
    const progress: number = Math.floor(quest.progress);
    const questNode: QuestNode = questDefinition.nodes[progress];

    let message = <p></p>;
    let actions = <p></p>;

    const handleEncounterOptionClick = (encounter: EncounterDefinition, option: string, oracle: any): any => {
        const result = encounter.answer(option, oracle, dispatch);

        /*if (!isEqual(questVars, props.quest.questVars)){
            props.onUpdateQuestVars(questVars);
        }*/
        const action = updateEncounterResult(quest.name, quest.progress, result);
        dispatch(action);
        dispatch(advanceQuest(quest.name));

       // props.onAdvanceQuest(props.quest.name);
    }

    // Todo: not happy about this, maybe refactor the whole oracle thing?
    const store = useSelector<StoreState, StoreState>((store) => store);


    switch (questNode.type) {
        case QuestNodeType.nothing: {
            message = <div> {
                log && log.map(textEntry => (<p>{TextManager.getTextEntry(textEntry)}</p>))
            } </div>;
            break;
        }
        case QuestNodeType.encounter: {
            // if (quest.encounterResults[quest.progress]) {
            //     message = <p> { quest.encounterResults[quest.progress] } </p>;
            //     break;
            // }
            const encounter = getEncounterDefinition(quest.currentEncounter!);
            const oracle = encounter.getOracle(quest.name, store);
            const descriptionTextEntry = encounter.getDescription(oracle);
            const descriptionText = TextManager.getTextEntry(descriptionTextEntry);

            message = <div><p> { descriptionText } </p></div>;

            const options = encounter.getOptions(oracle);

            actions = <ul>
                { Object.keys(options).map((o) => <li key={ o }>
                    <button onClick= { () => handleEncounterOptionClick(encounter, o, oracle) }>
                        { o }
                    </button>{ options[o]}
                </li>)}
            </ul>;

            break;
        }
        case QuestNodeType.boss: {
            message = <p> { "Boss fight!" } </p>;
            break;
        }
    }
    return (
        <div>
            <h1 className="app-h2">{TextManager.getQuestTitle(quest.name)}</h1>
            <div className="questlog">
                { message }
                <div className="actions">
                    { actions}
                </div>
            </div>
        </div>
    )
}

export default QuestDetails;

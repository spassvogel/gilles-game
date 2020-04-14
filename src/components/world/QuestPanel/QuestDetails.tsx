import React, { useCallback } from 'react';
import { QuestStoreState } from 'stores/quest';
import { TextManager } from 'global/TextManager';
import { getDefinition as getEncounterDefinition } from "definitions/encounters";
import { getDefinition as getQuestDefinition, QuestDefinition, QuestNode, QuestNodeType } from "definitions/quests";
import { EncounterDefinition } from 'definitions/encounters/types';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from 'stores';
import { selectQuestLogEntries } from 'selectors/quests';
import { TextEntry } from 'constants/text';
import { updateEncounterResult, advanceQuest } from 'actions/quests';
import TileMap from 'components/pixi/TileMap';
import { Stage, Graphics } from '@inlet/react-pixi';

interface Props {
    questName: string;
}

const QuestDetails = (props: Props) => {
    const questSelector = useCallback(
        (state: StoreState) => state.quests.find((q) => q.name === props.questName)!, 
        [props.questName]
    );
    const quest = useSelector<StoreState, QuestStoreState>(questSelector);
    //console.log("rendering questdetails ", JSON.stringify(quest));

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
                log && log.map(textEntry => (<p key={textEntry.key}>{TextManager.getTextEntry(textEntry)}</p>))
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
                    <button onClick= { () => handleEncounterOptionClick(encounter, o, oracle) } data-tip data-for="global">
                        { o }
                    </button>
                    <p>
                        { options[o]}
                    </p>
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
                <Stage width={1000/2} height={1000/2} >
                    <Graphics
                            name="hitarea"
                            draw={graphics => {
                                graphics.beginFill(0xBADA55);
                                graphics.drawRect(0, 0, 1000, 1000)
                                graphics.endFill();
                            }}
                        /> 
                    <TileMap />
                </Stage>
                { message }
                <div className="actions">
                    { actions}
                </div>
            </div>
        </div>
    )
}

export default QuestDetails;

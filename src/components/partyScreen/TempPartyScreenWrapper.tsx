
import * as React from "react";
import PartyScreen from "src/containers/partyScreen/PartyScreen";
import questDefinitions, { QuestDefinition, QuestNode, QuestNodeType } from "src/definitions/quests";
import { QuestStoreState } from "src/stores/quest";
import "./css/temppartyscreenwrapper.css";

export interface Props {
}

export interface DispatchProps {
    onAdvanceQuest: (questName: string) => void
}

export interface StateProps {
    quest: QuestStoreState
}

type AllProps = Props & StateProps & DispatchProps;
/**
 * Temporary wrapper around PartyScreen. Shows quest line
 * @param props 
 */
export default function(props: AllProps) {
    const { quest } = props;
    const questDefinition: QuestDefinition = questDefinitions[quest.name];

    const createNodeVisualization = (node: QuestNode, index: number) => {
        const className = quest.progress === index ? "active" : "";
        const spanProps = {
            className,
            key: `node_${index}`,
        };
        switch(node.type) {
            case QuestNodeType.encounter:
                return <span title="encounter" { ...spanProps }>*</span>;
            case QuestNodeType.boss:
                return <span title="boss" { ...spanProps }>#</span>;
            case QuestNodeType.nothing:
            default:
                return <span { ...spanProps }>-</span>;
            }
    }

    const questNodes = questDefinition.nodes.map((n, i) => createNodeVisualization(n, i));


    return <div className="temppartyscreenwrapper">
        <fieldset className="progress">
            <legend>Quest progress</legend>
            <div className="questnodes"> { questNodes } 
                <button className="next" onClick={ () => props.onAdvanceQuest(props.quest.name)}>>></button>
            </div>
        </fieldset>
        <PartyScreen quest= { props.quest } />
    </div>;
}

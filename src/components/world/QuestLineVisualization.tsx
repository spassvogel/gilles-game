
import * as React from "react";
import questDefinitions, { QuestDefinition, QuestNode, QuestNodeType } from "src/definitions/quests";
import { QuestStoreState } from "src/stores/quest";
import "./css/questlinevisualization.css";
import { TextManager } from "src/utils/textManager";

// tslint:disable-next-line:no-empty-interface
export interface Props {
    quest: QuestStoreState;
    selected: boolean;
    onSelectQuest: (questName: string) => void;
}

// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {
    // onAdvanceQuest: (questName: string) => void;
}

// tslint:disable-next-line:no-empty-interface
export interface StateProps {
}

type AllProps = Props & StateProps & DispatchProps;
/**
 * Shows quest line
 * @param props
 */
export default function(props: AllProps) {
    const { quest } = props;
    const questDefinition: QuestDefinition = questDefinitions[quest.name];

    const createNodeVisualization = (node: QuestNode, index: number) => {
        const progress: number = Math.floor(quest.progress);
        const className = progress === index ? "active" : "";
        const spanProps = {
            className,
            key: `node_${index}`,
        };
        switch (node.type) {
            case QuestNodeType.encounter:
                return <span title="encounter" { ...spanProps }>*</span>;
            case QuestNodeType.boss:
                return <span title="boss" { ...spanProps }>#</span>;
            case QuestNodeType.nothing:
            default:
                return <span { ...spanProps }>-</span>;
            }
    };

    const questNodes = questDefinition.nodes.map((n, i) => createNodeVisualization(n, i));

    return <div className="questlinevisualization"> 
        <div className="questname"> { TextManager.getQuestTitle(quest.name) } </div>
        { questNodes }
        { props.selected ? <span className="selected">selected</span> : <button className="select"
            onClick={ () => props.onSelectQuest(quest.name)}>select</button> }
    </div>;
}

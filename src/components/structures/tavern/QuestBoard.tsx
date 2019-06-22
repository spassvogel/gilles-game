import * as React from "react";
import { QuestStoreState } from "src/stores/quest";
import { TextManager } from "src/utils/textManager";
import "./css/questboard.css";

// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {
//    onUpgrade?: (cost: number) => void;
//   onCraft?: (productionDefinition: ProductionDefinition, workers: number) => void;
}

export interface StateProps {
    availableQuests: QuestStoreState[];
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
/*    type: Structure;*/
}

type AllProps = Props & StateProps & DispatchProps;

// tslint:disable-next-line:no-empty-interface
interface LocalState {
    selectedQuest: string | null;
}

export default class QuestBoard extends React.Component<AllProps, LocalState> {

    constructor(props: AllProps) {
        super(props);

        this.state = {
            selectedQuest: null,
        };
    }

    public render() {
        const questListContent: JSX.Element[] = this.props.availableQuests.map((q) => {
            const iconImgPath = `img/sigils/${ q.icon }`;
            const className = "quest" + ((q.name === this.state.selectedQuest) ? " selected" : "");
            return <li key={ q.name } className = { className } onClick = { () => { this.handleQuestClick(q.name); } }>
                <div
                    className = "icon"
                    style={{backgroundImage: `url(${iconImgPath})`}}
                ></div>
                <div className = "title">{ TextManager.getQuestTitle(q.name) } </div>
            </li>;
        });

        // quest board, expanded quest info + assign adventurers + launch button
        return <div className = "quest-board">
            <h2>Quest board</h2>
            <ul className = "quest-list">
                { questListContent }
            </ul>
            <div className="quest-details">

            </div>
        </div>;
    };
   

    private handleQuestClick(name: string) {
        if (this.state.selectedQuest === name) {
            this.setState( { selectedQuest: null });
        } else {
            this.setState( { selectedQuest: name });
        }
    }
}


import * as React from "react";
import PartyScreen from "src/containers/partyScreen/PartyScreen";
import { QuestStoreState } from "src/stores/quest";
import QuestLineVisualization from "../world/QuestLineVisualization";
import "./css/realworldview.css";

// tslint:disable-next-line:no-empty-interface
export interface Props {
}

export interface DispatchProps {
    onAdvanceQuest: (questName: string) => void;
}

export interface StateProps {
    quests: QuestStoreState[];
}

interface LocalState {
    selectedQuest: string | null;
}

type AllProps = Props & StateProps & DispatchProps;
/**
 * Temporary wrapper around PartyScreen. Shows quest line
 * @param props
 */
export default class RealWorldView extends React.Component<AllProps, LocalState> {
    // This Component has local state, so it's a class
    constructor(props: Props & StateProps & DispatchProps) {
        super(props);

        this.state = {
            selectedQuest: null,
        };
    }

    public render() {
            const selectedQuest = this.props.quests.find(q => q.name === this.state.selectedQuest);

            const questLines = this.props.quests.map(q => {
                return <QuestLineVisualization key={ q.name }
                    selected = { q === selectedQuest }
                    quest={ q }
                    onSelectQuest={ () => this.handleSelectQuest(q.name) }
                />;
            });

            return <div className="realworldview">
                <fieldset className="progress">
                    <legend>Quest progress</legend>
                    { questLines }
                </fieldset>
                { selectedQuest && <PartyScreen quest= { selectedQuest } /> }
            </div>;
    }

    public handleSelectQuest(questName: string) {
        this.setState({
            selectedQuest: questName,
        });
    }
}


import * as React from "react";
import PartyScreen from "src/containers/partyScreen/PartyScreen";
import { QuestStatus, QuestStoreState } from "src/stores/quest";
import { MusicTrack, SoundManager } from "src/utils/soundManager";
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
    private music: Howl;

    // This Component has local state, so it's a class
    constructor(props: Props & StateProps & DispatchProps) {
        super(props);

        this.state = {
            selectedQuest: null,
        };

        SoundManager.addMusicTrack(MusicTrack.world, "sound/music/TheLoomingBattle.ogg");

    }

    public render() {
        const selectedQuest = this.props.quests.find((q) => q.name === this.state.selectedQuest);
        const activeQuests = this.props.quests.filter((q) => q.status === QuestStatus.active );
        const questLines = activeQuests.map((q) => {
            return <QuestLineVisualization key={ q.name }
                selected={q === selectedQuest}
                quest={q}
                onSelectQuest={() => this.handleSelectQuest(q.name)}
            />;
        });

        return <div className="realworldview">
            <fieldset className="progress">
                <legend>Quest progress</legend>
                {questLines}
            </fieldset>
            { selectedQuest && <PartyScreen quest= { selectedQuest } /> }
        </div>;
    }

    public handleSelectQuest(questName: string) {
        this.setState({
            selectedQuest: questName,
        });
    }

    public componentDidMount() {
        this.playMusic();
    }

    private playMusic() {
       SoundManager.playMusicTrack(MusicTrack.world);
    }

}

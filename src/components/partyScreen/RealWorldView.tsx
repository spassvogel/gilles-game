import PartyWindow from "containers/windows/PartyWindow";
import { AppContextProps } from "hoc/withAppContext";
import * as React from "react";
import { QuestStatus, QuestStoreState } from "stores/quest";
import { MusicTrack, SoundManager } from "utils/soundManager";
import { TextManager } from "utils/textManager";
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

type AllProps = Props & StateProps & DispatchProps & AppContextProps;
/**
 * Temporary wrapper around PartyScreen. Shows quest line
 * @param props
 */
export default class RealWorldView extends React.Component<AllProps, LocalState> {

    // This Component has local state, so it's a class
    constructor(props: AllProps) {
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
        </div>;
    }

    public handleSelectQuest(questName: string) {
        this.setState({
            selectedQuest: questName,
        });
        const quest = this.props.quests.find((q) => q.name === questName)!;
        const title = TextManager.getQuestTitle(quest.name);
        const window = <PartyWindow quest = { quest }  title = { title } />;
        this.props.onOpenWindow(window);
    }

    public componentDidMount() {
        this.playMusic();
    }

    private playMusic() {
       SoundManager.playMusicTrack(MusicTrack.world);
    }

}

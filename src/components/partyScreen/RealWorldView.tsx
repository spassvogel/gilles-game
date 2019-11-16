import WorldMap from "components/three/world/WorldMap";
import PartyWindow from "containers/windows/PartyWindow";
import { AppContextProps } from "hoc/withAppContext";
import React, { useRef, useEffect } from "react";
import { QuestStatus, QuestStoreState } from "stores/quest";
import { MusicTrack, SoundManager } from "utils/soundManager";
import { TextManager } from "utils/textManager";
import QuestLineVisualization from "../world/QuestLineVisualization";
import "./css/realworldview.css";
import { Vector2 } from "three";

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

//
// todo: convert to pure function
/**
 * Temporary wrapper around PartyScreen. Shows quest line
 * @param props
 */
const RealWorldView = (props: AllProps) => {
    const compassRef = useRef<HTMLDivElement>(null);
    
        // this.state = {
        //     selectedQuest: null,
        // };

    useEffect(() => {
        SoundManager.addMusicTrack(MusicTrack.world, "sound/music/TheLoomingBattle.ogg");
        SoundManager.playMusicTrack(MusicTrack.world);
    }, []);

    const handleMapMove = (distance: number, angle: number) => {
        const compassEl = compassRef!.current!;
        // Rotate the compass
        compassEl.style.transform = `rotate(${angle - (Math.PI / 2)}rad)`;
        compassEl.style.opacity = distance > 10 ? "1" : "0";
        compassRef!.current!.firstElementChild!.innerHTML = `${distance.toFixed(0)}`;
    }

    const handleCompassClick = () => {
        console.log('scroll to town!');
    }

    return (
        // const selectedQuest = this.props.quests.find((q) => q.name === this.state.selectedQuest);
        // const activeQuests = this.props.quests.filter((q) => q.status === QuestStatus.active );
        // const questLines = activeQuests.map((q) => {
        //     return <QuestLineVisualization key={q.name}
        //         selected={q === selectedQuest}
        //         quest={q}
        //         onSelectQuest={() => this.handleSelectQuest(q.name)}
        //     />;
        // });
        <div className="realworldview">
            {/* <fieldset className="progress">
                <legend>Quest progress</legend>
                {questLines}
            </fieldset> */}
            <div className="compass" ref={compassRef} onClick={handleCompassClick}>
                <div className="distance"></div>
            </div>
            <WorldMap quests={props.quests} onMapMove={handleMapMove} compassCenter={new Vector2(525, 585)} />
        </div>
    );

    // public handleSelectQuest(questName: string) {
    //     this.setState({
    //         selectedQuest: questName,
    //     });
    //     const quest = this.props.quests.find((q) => q.name === questName)!;
    //     const title = TextManager.getQuestTitle(quest.name);
    //     const window = <PartyWindow quest={quest} title={title} />;
    //     this.props.onOpenWindow(window);
    // }
}

export default RealWorldView;
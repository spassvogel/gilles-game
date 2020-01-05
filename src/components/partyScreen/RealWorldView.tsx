import { AppContext } from "components/App";
import WorldMap from "components/three/world/WorldMap";
import PartyWindow from "containers/windows/PartyWindow";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { QuestStatus, QuestStoreState } from "stores/quest";
import { Vector2 } from "three";
import { MusicTrack, SoundManager } from "utils/soundManager";
import { TextManager } from "utils/textManager";
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

type AllProps = Props & StateProps & DispatchProps;

/**
 * Temporary wrapper around PartyScreen. Shows quest line
 * @param props
 */
const RealWorldView = (props: AllProps) => {
    const compassRef = useRef<HTMLDivElement>(null);
    const worldMapRef = useRef<HTMLDivElement>(null);
    const [scrollToPosition, setScrollToPosition] = useState<Vector2>();
    const [selectedQuest, setSelectedQuest] = useState<string>();
    const [controllerEnabled, setControllerEnabled] = useState(true);

    const context = React.useContext(AppContext)!;

    const mouseout = () => {
        setControllerEnabled(false);
    };

    const mouseover = () => {
        setControllerEnabled(true);
    };

    useEffect(() => {
        SoundManager.addMusicTrack(MusicTrack.world, "sound/music/TheLoomingBattle.ogg");
        SoundManager.playMusicTrack(MusicTrack.world);

        (worldMapRef.current!).addEventListener("mouseout", mouseout);
        (worldMapRef.current!).addEventListener("mouseover", mouseover);

        return () => {
            (worldMapRef.current!).removeEventListener("mouseout", mouseout);
            (worldMapRef.current!).removeEventListener("mouseover", mouseover);
        };
    }, []);

    const handleMapMove = (distance: number, angle: number) => {
        const compassEl = compassRef!.current!;
        const compassTextEl = compassEl.firstElementChild! as HTMLElement;

        // Rotate the compass
        compassEl.style.transform = `rotate(${angle - (Math.PI / 2)}rad)`;
        compassEl.style.opacity = distance > 10 ? "1" : "0";
        compassTextEl.style.transform = `rotate(${-angle + (Math.PI / 2)}rad)`;
        compassTextEl.innerHTML = `${distance.toFixed(0)}`;
    };

    const handleCompassClick = () => {
        setScrollToPosition(new Vector2(1, 1));
    };

    const handlePartyClick = (questName: string) => {
        setSelectedQuest(questName);

        const quest = props.quests.find((q) => q.name === questName)!;
        const title = TextManager.getQuestTitle(quest.name);
        const window = <PartyWindow quest={quest} title={title} />;
        context.onOpenWindow(window);
    };

    const activeQuests = useMemo(() => {
        return props.quests.filter((q) => q.status === QuestStatus.active);
    }, [props.quests]);

    return (
        <div className="realworldview" ref={worldMapRef}>
            <div className="compass" ref={compassRef} onClick={handleCompassClick}>
                <div className="distance"/>
            </div>
            <WorldMap
                quests={props.quests}
                activeQuests={activeQuests}
                selectedQuest={selectedQuest}
                compassCenter={new Vector2(525, 585)}
                scrollToPosition={scrollToPosition}
                onMapMove={handleMapMove}
                onPartyClick={handlePartyClick}
                controllerEnabled={controllerEnabled}
            />
        </div>
    );
};

export default RealWorldView;

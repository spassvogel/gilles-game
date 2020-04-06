import { AppContext } from "components/App";
import WorldMap from "components/world/WorldMap";
import PartyWindow from "containers/windows/PartyWindow";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { QuestStatus, QuestStoreState } from "stores/quest";
import { MusicTrack, SoundManager } from "utils/soundManager";
import { TextManager } from "utils/textManager";
import "./css/worldView.css";
import { useSelector } from 'react-redux';
import { StoreState } from 'stores';
import { selectActiveQuests } from 'selectors/quests';
import QuestPanel from './QuestPanel';

// tslint:disable-next-line:no-empty-interface
export interface Props {
}


/**
 * Temporary wrapper around PartyScreen. Shows quest line
 * @param props
 */
const RealWorldView = (props: Props) => {
    const compassRef = useRef<HTMLDivElement>(null);
    const worldMapRef = useRef<HTMLDivElement>(null);
    const [selectedQuest, setSelectedQuest] = useState<QuestStoreState>();
    const [controllerEnabled, setControllerEnabled] = useState(true);

    const activeQuests = useSelector<StoreState, QuestStoreState[]>((store) => selectActiveQuests(store));

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

    // const handleMapMove = (distance: number, angle: number) => {
    //     const compassEl = compassRef!.current!;
    //     const compassTextEl = compassEl.firstElementChild! as HTMLElement;

    //     // Rotate the compass
    //     compassEl.style.transform = `rotate(${angle - (Math.PI / 2)}rad)`;
    //     compassEl.style.opacity = distance > 10 ? "1" : "0";
    //     compassTextEl.style.transform = `rotate(${-angle + (Math.PI / 2)}rad)`;
    //     compassTextEl.innerHTML = `${distance.toFixed(0)}`;
    // };

    // const handleCompassClick = () => {
    //     //setScrollToPosition(new Vector2(1, 1));
    // };

    const handlePartyClick = (questName: string) => {
        const quest = activeQuests.find((q) => q.name === questName)!;
        if (quest === selectedQuest) {
            setSelectedQuest(undefined);
        } else {
            setSelectedQuest(quest);
        }

        const title = TextManager.getQuestTitle(quest.name);
        //console.log(quest)
        //const window = <PartyWindow quest={quest} title={title} />;
        //context.onOpenWindow(window);
    };

    return (
        <div className="world-view" ref={worldMapRef}>
            {/* <div className="compass" ref={compassRef} onClick={handleCompassClick}>
                <div className="distance"/>
            </div> */}
            <WorldMap
                selectedQuest={selectedQuest}
                // onMapMove={handleMapMove}
                smallMap={selectedQuest != null}
                onPartyClick={handlePartyClick}
                controllerEnabled={controllerEnabled}
            />
            { selectedQuest && (
                <QuestPanel quest={selectedQuest} />
            )}
        </div>
    );
};

export default RealWorldView;

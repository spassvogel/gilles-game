import WorldMap from "components/world/WorldMap";
import React, { useEffect, useRef, useState } from "react";
import { MusicTrack, SoundManager } from "utils/soundManager";
import "./css/worldView.css";
import QuestPanel from './QuestPanel';

// tslint:disable-next-line:no-empty-interface
export interface Props {
}


/**
 * WorldView shows the map and QuestPanel
 * @param props
 */
const RealWorldView = () => {
    const worldMapRef = useRef<HTMLDivElement>(null);
    const [selectedQuestName, setSelectedQuestName] = useState<string>();


 

    useEffect(() => {
        SoundManager.addMusicTrack(MusicTrack.world, "sound/music/TheLoomingBattle.ogg");
        SoundManager.playMusicTrack(MusicTrack.world);
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
        if (questName === selectedQuestName) {
            setSelectedQuestName(undefined);
        } else {
            setSelectedQuestName(questName);
        }
    };

    return (
        <div className="world-view" ref={worldMapRef}>
            {/* <div className="compass" ref={compassRef} onClick={handleCompassClick}>
                <div className="distance"/>
            </div> */}
            <WorldMap
                selectedQuestName={selectedQuestName}
                // onMapMove={handleMapMove}
                smallMap={selectedQuestName != null}
                onPartyClick={handlePartyClick}
            />
            { selectedQuestName && (
                <QuestPanel questName={selectedQuestName} />
            )}
        </div>
    );
};

export default RealWorldView;

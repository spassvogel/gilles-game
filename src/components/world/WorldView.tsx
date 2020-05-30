import WorldMap from "components/world/WorldMap";
import React, { useEffect, useRef } from "react";
import { MusicTrack, SoundManager, Sound } from "global/SoundManager";
import "./css/worldView.css";
import QuestPanel from './QuestPanel';
import { useRouteMatch, useHistory } from 'react-router';
import { getQuestLink, getWorldLink } from 'utils/routing';

// tslint:disable-next-line:no-empty-interface
export interface Props {
}


/**
 * WorldView shows the map and QuestPanel
 * @param props
 */
const RealWorldView = () => {
    const worldMapRef = useRef<HTMLDivElement>(null);
    const match = useRouteMatch(`${getWorldLink()}/:questname`);
    const selectedQuestName = match?.params['questname'];
    const history = useHistory();

    useEffect(() => {
        SoundManager.addMusicTrack(MusicTrack.world, "sound/music/TheLoomingBattle.ogg");
        SoundManager.playMusicTrack(MusicTrack.world);
    }, []);

    // console.log(params.questname);
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
            history.push(getWorldLink());
        } else {
            history.push(getQuestLink(questName));
        }
        SoundManager.playSound(Sound.buttonClick);
    };

    const handleRetrieveWorldViewRef = () => {
        return worldMapRef;
    }

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
                retrieveWorldViewRef={handleRetrieveWorldViewRef}
            />
            { selectedQuestName && (
                <QuestPanel questName={selectedQuestName} />
            )}
        </div>
    );
};

export default RealWorldView;

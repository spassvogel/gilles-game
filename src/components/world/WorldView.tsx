import WorldMap from "components/world/WorldMap";
import React, { useEffect, useRef } from "react";
import { Channel, MixMode, SoundManager } from "global/SoundManager";
import QuestPanel from './QuestPanel';
import { useRouteMatch, useHistory } from 'react-router';
import { getQuestLink, getWorldLink } from 'utils/routing';
import "./styles/worldView.scss";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Props {
}

/**
 * WorldView shows the map and QuestPanel
 * @param props
 */
const WorldView = () => {
  const worldViewRef = useRef<HTMLDivElement>(null);
  const match = useRouteMatch<{questname: string}>(`${getWorldLink()}/:questname`);
  const selectedQuestName = match?.params.questname;
  const history = useHistory();

  useEffect(() => {
    SoundManager.addSound("music/world", "sound/music/TheLoomingBattle.ogg", () => {
      SoundManager.playSound("music/world", Channel.music, true, MixMode.fade, true);
    })
  }, []);

  // const handleMapMove = (distance: number, angle: number) => {
  //   const compassEl = compassRef!.current!;
  //   const compassTextEl = compassEl.firstElementChild! as HTMLElement;

  //   // Rotate the compass
  //   compassEl.style.transform = `rotate(${angle - (Math.PI / 2)}rad)`;
  //   compassEl.style.opacity = distance > 10 ? "1" : "0";
  //   compassTextEl.style.transform = `rotate(${-angle + (Math.PI / 2)}rad)`;
  //   compassTextEl.innerHTML = `${distance.toFixed(0)}`;
  // };

  // const handleCompassClick = () => {
  //   //setScrollToPosition(new Vector2(1, 1));
  // };

  const handlePartyClick = (questName: string) => {
    // if (questName === selectedQuestName) {
    //   history.push(getWorldLink());
    // } else {
      history.push(getQuestLink(questName));
    // }
    SoundManager.playSound("ui/buttonClick");
  };

  const handleRetrieveWorldViewRef = () => {
    return worldViewRef;
  }

  return (
    <div className="world-view" ref={worldViewRef}>
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

export default WorldView;

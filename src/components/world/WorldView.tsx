import WorldMap from 'components/world/WorldMap'
import { useEffect, useRef } from 'react'
import { Channel, MixMode, SoundManager } from 'global/SoundManager'
import QuestPanel from './QuestPanel'
import { useMatch, useNavigate } from 'react-router'
import { getWorldLink } from 'utils/routing'
import LoadingPage from 'components/ui/loading/LoadingPage'
import useQuestExists from './hooks/useQuestExists'

import './styles/worldView.scss'

/**
 * WorldView shows the map and QuestPanel
 * @param props
 */
const WorldView = () => {
  const worldViewRef = useRef<HTMLDivElement>(null)
  const match = useMatch(`${getWorldLink()}/:questname`)
  const selectedQuestName = match?.params.questname
  const navigate = useNavigate()

  // we need to verify if the quest in the url actually exists
  const questExists = useQuestExists(selectedQuestName)

  useEffect(() => {
    // requesting a quest that doesnt actually exist redirects to world
    if (questExists === false) {
      navigate(getWorldLink())
    }
  }, [navigate, questExists])

  useEffect(() => {
    void SoundManager.playSound('MUSIC_WORLD', Channel.music, true, MixMode.fade, true)
  }, [])

  // const handleMapMove = (distance: number, angle: number) => {
  //   const compassEl = compassRef!.current!
  //   const compassTextEl = compassEl.firstElementChild! as HTMLElement

  //   // Rotate the compass
  //   compassEl.style.transform = `rotate(${angle - (Math.PI / 2)}rad)`
  //   compassEl.style.opacity = distance > 10 ? "1" : "0"
  //   compassTextEl.style.transform = `rotate(${-angle + (Math.PI / 2)}rad)`
  //   compassTextEl.innerHTML = `${distance.toFixed(0)}`
  // }

  // const handleCompassClick = () => {
  //   //setScrollToPosition(new Vector2(1, 1))
  // }

  const handlePartyClick = (questName: string) => {
    navigate(questName)
    void SoundManager.playSound('UI_BUTTON_CLICK')
  }

  const handleRetrieveWorldViewRef = () => {
    return worldViewRef
  }

  if (selectedQuestName != null && questExists !== true) {
    return (
      <LoadingPage/>
    )
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
      { selectedQuestName !== undefined && (
        <QuestPanel questName={selectedQuestName} />
      )}
    </div>
  )
}

export default WorldView

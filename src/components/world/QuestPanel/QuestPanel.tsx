import { useState, useEffect } from 'react'
import { createSelectAdventurersOnQuest } from 'store/selectors/adventurers'
import { useSelector } from 'react-redux'
import QuestDetails from './QuestDetails'
import { useNavigate } from 'react-router-dom'
import { getWorldLink } from 'utils/routing'
import { useQuest } from 'hooks/store/quests'
import SceneControllerContextProvider from './context/SceneControllerContext'
import CombatBar from './CombatBar'
import AdventurersPanel from './AdventurersPanel'
import ActorsAccordion from './ActorsAccordion'
import { getSceneObjectWithName } from 'store/helpers/storeHelpers'
import { isEnemy, type SceneObject } from 'store/types/scene'
import SceneModal from './modals/SceneModal'

import './styles/questPanel.scss'

enum Layout {
  auto, // horizontal on large screens, vertical on small screens
  vertical,
  horizontal,
}

type Props = {
  questName: string
  layout?: Layout
}

const isEnemySelected = (objects: SceneObject[], name: string): boolean => {
  const selectedObject = getSceneObjectWithName(objects, name)
  return !(selectedObject == null) && isEnemy(selectedObject)
}

const QuestPanel = (props: Props) => {
  const navigate = useNavigate()
  const { layout = Layout.auto, questName } = props
  const adventurers = useSelector(createSelectAdventurersOnQuest(questName))
  const leader = adventurers[0]
  const [selectedActorId, setSelectedActorId] = useState<string>(leader?.id)

  const quest = useQuest(questName)
  const activeInteractionModal = quest?.scene?.activeInteractionModal

  const handleActorSelected = (actorId: string) => {
    // can only select enemies when in combat
    // in fact, only time enemies are visible is in combat, but still ...
    if ((!((quest?.scene?.combat) ?? false) && isEnemySelected(quest.scene?.objects ?? [], actorId))) {
      return
    }
    setSelectedActorId(actorId)
  }

  useEffect(() => {
    if (adventurers.length === 0) {
      // no adventurers, something went wrong, perhaps invalid url
      // bounce back to world
      navigate(getWorldLink())
    }
  }, [adventurers.length, navigate])

  useEffect(() => {
    // When returning from combat and an enemy is still selected, select the leader instead
    if (!((quest?.scene?.combat) ?? false) && (selectedActorId.length > 0)) {
      const enemySelected = isEnemySelected(quest.scene?.objects ?? [], selectedActorId)
      if (enemySelected) {
        setSelectedActorId(leader?.id)
      }
    }
  }, [leader?.id, quest.scene?.combat, quest.scene?.objects, selectedActorId])
  if ((adventurers.length === 0) || quest.sceneName === undefined) return null

  return (
    <SceneControllerContextProvider questName={questName}>
        <div className={`quest-panel quest-panel-${Layout[layout]}`}>
          <div className="quest-area">
            <QuestDetails
              questName={questName}
              selectedActorId={selectedActorId}
              setSelectedActor={handleActorSelected}
            />
          </div>
          <div className="party-area">
          { !((quest?.scene?.combat) ?? false) && (
            <AdventurersPanel
              adventurers={adventurers}
              adventurerId={selectedActorId}
              onAdventurerTabSelected={handleActorSelected}
              disabled={activeInteractionModal !== undefined}
              questName={questName}
            />
          )}
          { ((quest?.scene?.combat) ?? false) && (
            <>
              <CombatBar questName={questName} selectedAdventurerId={selectedActorId}/>
              <ActorsAccordion
                selectedActorId={selectedActorId}
                questName={questName}
                onActorSelected={handleActorSelected}
              />
            </>
          )}
          </div>
        </div>
    </SceneControllerContextProvider>
  )
}

export default QuestPanel

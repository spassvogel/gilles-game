import { useQuest } from 'hooks/store/quests'
import { useDispatch } from 'react-redux'
import LootCache from '../LootCache'
import { setActiveSceneInteractionModal } from 'store/actions/quests'
import Situation from '../Situation'
import { useAdventurersOnQuest } from 'hooks/store/adventurers'
import { useMemo } from 'react'
import QuestFailed from '../QuestFailed/QuestFailed'

import '../styles/sceneModal.scss'

type Props = {
  questName: string
  selectedActorId: string
}

const SceneModal = (props: Props) => {
  const { questName, selectedActorId } = props
  const quest = useQuest(questName)
  const adventurers = useAdventurersOnQuest(questName)
  const dispatch = useDispatch()
  const activeInteractionModal = quest?.scene?.activeInteractionModal

  const questFailed = useMemo(() => {
    return adventurers.every((a) => a.health <= 0)
  }, [adventurers])

  const handleCloseInteractionModal = () => {
    dispatch(setActiveSceneInteractionModal(questName))
  }

  if (questFailed) {
    return (
      <div className="modal-backdrop" onClick={handleCloseInteractionModal}>
        <QuestFailed questName={questName} />
      </div>
    )
  }

  if (activeInteractionModal == null) {
    return null
  }

  if (activeInteractionModal.type === 'lootCache') {
    return (
      <div className="modal-backdrop" onClick={handleCloseInteractionModal}>
        <LootCache
          cacheName={activeInteractionModal.lootCache}
          adventurerId={selectedActorId}
          onClose={handleCloseInteractionModal}
        />
      </div>
    )
  }

  if (activeInteractionModal.type === 'situation') {
    return (
      <div className="modal-backdrop" onClick={handleCloseInteractionModal}>
        <Situation
          situation={activeInteractionModal.situation}
          adventurerId={selectedActorId}
          onClose={handleCloseInteractionModal}
          />
      </div>
    )
  }
}

export default SceneModal

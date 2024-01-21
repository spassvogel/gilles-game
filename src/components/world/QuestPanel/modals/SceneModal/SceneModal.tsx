import { useQuest } from 'hooks/store/quests'
import LootCache from '../LootCache'
import { useDispatch } from 'react-redux'
import { setActiveSceneInteractionModal } from 'store/actions/quests'
import Situation from '../Situation'

type Props = {
  questName: string
  selectedActorId: string
}

const SceneModal = (props: Props) => {
  const { questName, selectedActorId } = props
  const quest = useQuest(questName)
  const dispatch = useDispatch()
  const activeInteractionModal = quest?.scene?.activeInteractionModal

  const handleCloseInteractionModal = () => {
    dispatch(setActiveSceneInteractionModal(questName))
  }

  return (
    <>
    {(activeInteractionModal != null) && activeInteractionModal.type === 'lootCache' && (
      <div className="modal" onClick={handleCloseInteractionModal}>
        <LootCache
          cacheName={activeInteractionModal.lootCache}
          adventurerId={selectedActorId}
          onClose={handleCloseInteractionModal}
        />
      </div>
    )}
    { (activeInteractionModal != null) && activeInteractionModal.type === 'situation' && (
      <div className="modal" onClick={handleCloseInteractionModal}>
        <Situation
          situation={activeInteractionModal.situation}
          adventurerId={selectedActorId}
          onClose={handleCloseInteractionModal}
          />
      </div>
    )}
    </>
  )
}

export default SceneModal

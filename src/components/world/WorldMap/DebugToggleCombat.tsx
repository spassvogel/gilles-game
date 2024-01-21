import { useDispatch } from 'react-redux'
// import MapGrid from './MapGrid'
import { useQuest } from 'hooks/store/quests'
import { setCombat, startTurn } from 'store/actions/quests'
import { Allegiance } from 'store/types/scene'
import { useAdventurers } from 'hooks/store/adventurers'

// temporary
export const DebugToggleCombat = ({ questName }: { questName: string }) => {
  const quest = useQuest(questName)
  const adventurers = useAdventurers()
  const dispatch = useDispatch()

  const startCombat = () => {
    dispatch(startTurn(quest.name, Allegiance.player, adventurers))
    dispatch(setCombat(questName, true))
  }

  if (quest.scene?.combat === true && quest.scene.turn !== undefined) {
    return (
      <button onClick={() => dispatch(setCombat(questName, false))} title="For debug only!">
        combat: on ({Allegiance[quest.scene.turn]})
      </button>
    )
  }
  return (
    <button onClick={startCombat} title="For debug only!">
      combat: off
    </button>
  )
}

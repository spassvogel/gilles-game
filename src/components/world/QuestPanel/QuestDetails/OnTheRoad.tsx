import { useQuest } from 'hooks/store/quests'
import { getDefinition } from 'definitions/quests'
import { type QuestDefinition } from 'definitions/quests/types'
import * as TextManager from 'global/TextManager'
import './styles/onTheRoad.scss'

export type Props = {
  questName: string
}

/* Shows the most recent log on a questnode */
const OnTheRoad = (props: Props) => {
  const quest = useQuest(props.questName)
  const questDefinition: QuestDefinition = getDefinition(quest.name)
  let progress: number = Math.floor(quest.progress)
  do {
    const log = questDefinition.nodes[progress].log
    if (log !== undefined) {
      return (
        <div>
          <p>{`${TextManager.get(log)}`}</p>
        </div>
      )
    }
    progress--
  } while (progress >= 0)
  return <h1 className="on-the-road questname">{TextManager.getQuestTitle(quest.name)}</h1>
}

export default OnTheRoad

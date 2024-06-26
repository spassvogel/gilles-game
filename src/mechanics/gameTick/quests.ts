import { type TextEntry } from 'constants/text'
import { getDefinition } from 'definitions/quests'
import { type QuestDefinition, QuestNodeType } from 'definitions/quests/types'

import { type Store } from 'redux'
import { type StoreState } from 'store/types'
import { LogChannel } from 'store/types/logEntry'
import { QuestStatus, type QuestStoreState } from 'store/types/quest'
import { ToastEmitter } from 'emitters/ToastEmitter'
import * as TextManager from 'global/TextManager'
import { Type } from 'components/ui/toasts/Toast'
import { getQuestLink } from 'utils/routing'
import { setSceneName } from 'store/actions/quests'
import { getQuestLeader } from 'store/helpers/storeHelpers'
import { getTimeMultiplier, TimeType } from 'mechanics/time'
import { AVATAR_IMAGE_BASE_PATH } from 'constants/paths'

export type QuestUpdate = {
  name: string
  progress: number
}

export type LogUpdate = {
  key: string
  channel: LogChannel
  channelContext?: string
} & TextEntry

type QuestGameTickResponse = {
  quests: QuestUpdate[]
  logUpdates: LogUpdate[]
}

// Updates on the entire quest line
const getQuestUpdates = (delta: number, store: Store<StoreState>): QuestGameTickResponse => {
  const speed = 4 // in nodes per minute
  const timeMultiplier = getTimeMultiplier(TimeType.questProgress)
  const MS_PER_MINUTE = 60000
  const log: LogUpdate[] = []
  const quests: QuestUpdate[] = []
  const state: StoreState = store.getState()

  // Will set the scene name on the given quest
  // SceneControllerContextProvider will detect this and load the scene data
  const initializeScene = (quest: QuestStoreState, sceneName: string) => {
    store.dispatch(setSceneName(quest.name, sceneName))

    const questTitle = TextManager.getQuestTitle(quest.name)
    const leader = getQuestLeader(state.adventurers, quest)
    ToastEmitter.addToast(questTitle, Type.questEncounter, `${AVATAR_IMAGE_BASE_PATH}${leader?.avatarImg}`, getQuestLink(quest.name))
  }

  // Moves the quest line progress. Only if currently at a 'nothing' node
  // Otherwise the player has to do something to move the quest along
  state.quests.forEach((quest: QuestStoreState) => {
    if (quest.status !== QuestStatus.active) {
      return
    }
    const questDefinition: QuestDefinition = getDefinition(quest.name)
    const currentProgress = quest.progress
    const currentNodeIndex = Math.floor(currentProgress)
    const currentNode = questDefinition.nodes[currentNodeIndex]

    if (currentNode.type === QuestNodeType.encounter) {
      if (quest.sceneName === undefined) {
        // This happens when the first node is an encounter. Initialize it right away
        initializeScene(quest, currentNode.startScene)
      }
    }
    if (currentNode.type === QuestNodeType.nothing) {
      // Currently at a 'nothing' node
      const progressIncrease = (delta / (MS_PER_MINUTE / timeMultiplier)) * speed
      // todo: [15/07/2019] speed could be different for each party
      let nextProgress = Math.min(currentProgress + progressIncrease, questDefinition.nodes.length - 1)
      const nodesPassed = Math.floor(nextProgress) - currentNodeIndex
      for (let i = 1; i <= nodesPassed; i++) {
        // Loop through all the nodes we've passed since last tick
        const nextNode = questDefinition.nodes[currentNodeIndex + i]
        if (nextNode.type === QuestNodeType.encounter) {
          // We've hit an encounter node. set the progress to here and stop looking at other nodes
          initializeScene(quest, nextNode.startScene)

          // Add quest to log
          if (nextNode.log !== undefined) {
            log.push({
              channel: LogChannel.quest,
              channelContext: quest.name,
              key: nextNode.log
            })
          }
          // Dont overshoot the encounter node
          nextProgress = currentProgress + i

          break
        } else if (nextNode.type === QuestNodeType.nothing) {
          if (nextNode.log !== undefined) {
            log.push({
              channel: LogChannel.quest,
              channelContext: quest.name,
              key: nextNode.log
            })
          }
        }
      }
      quests.push({
        name: quest.name,
        progress: nextProgress
      })
    }
  })
  return {
    logUpdates: log,
    quests
  }
}

export default getQuestUpdates

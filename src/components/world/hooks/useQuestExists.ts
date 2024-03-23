import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { type StoreState } from 'store/types'
import { type QuestStoreState } from 'store/types/quest'

/**
 * Will return true if the questName exists. false if it does *not* exist. undefined when we are still searching
 * or if we provided no questName
 */
const useQuestExists = (questName?: string) => {
  const quests = useSelector<StoreState, QuestStoreState[]>((state) => state.quests)
  const [questExists, setQuestExists] = useState<boolean>()

  useEffect(() => {
    if (questName == null) {
      setQuestExists(undefined)
    } else {
      const doesItExist = quests.find((q) => q.name === questName) != null
      setQuestExists(doesItExist)
    }
  }, [quests, questName])

  return questExists
}

export default useQuestExists

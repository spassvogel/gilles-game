import { createContext, type PropsWithChildren, useState, useMemo, useEffect } from 'react'
import { useStore } from 'react-redux'
import { type BaseSceneController } from 'mechanics/scenes/BaseSceneController'
import { type StoreState } from 'store/types'
import LoadingSpinner from 'components/ui/loading/LoadingSpinner'
import usePrevious from 'hooks/usePrevious'
import { getSceneController } from 'global/SceneControllerManager'
import { type Action } from 'store/actions'

export const SceneControllerContext = createContext<BaseSceneController<unknown> | null>(null)

export type Props = {
  questName: string
}

const SceneControllerContextProvider = (props: PropsWithChildren<Props>) => {
  const { questName, children } = props
  const store = useStore<StoreState, Action>()
  const [loaded, setLoaded] = useState<boolean>(false)
  const storeState = store.getState()
  const quest = storeState.quests.find(q => q.name === questName)
  if (quest == null) throw Error('No quest found')
  const { scene, sceneName, questVars } = quest
  const previousQuestVars = usePrevious(questVars)

  const controller = useMemo(() => {
    if (sceneName == null) {
      return null
    }
    return getSceneController(questName, sceneName, store)
  }, [questName, sceneName, store])

  useEffect(() => {
    setLoaded(false)
    if (sceneName != null && controller != null && !controller.dataLoading) {
      const loadingComplete = () => {
        setLoaded(true)

        // If the store has no scene for this quest yet, create and store it!
        if ((scene == null) && controller != null) {
          controller.createScene()
        }
        controller.sceneEntered()
      }
      void controller.loadData(loadingComplete)
    }
    return () => {
      controller?.sceneExited()
    }
  }, [controller, questName, scene, sceneName])

  useEffect(() => {
    if (questVars !== previousQuestVars && controller?.dataLoadComplete) {
      controller.updateScene()
    }
  }, [controller, previousQuestVars, questVars])

  if (controller != null && (controller.dataLoading || !loaded)) {
    return (
      <LoadingSpinner />
    )
  }
  return (
    <SceneControllerContext.Provider value={controller}>
      {children}
    </SceneControllerContext.Provider>
  )
}

export default SceneControllerContextProvider

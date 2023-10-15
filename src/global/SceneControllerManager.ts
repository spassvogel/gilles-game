import { type Store, type AnyAction } from 'redux'
import { type StoreState } from 'store/types'
import { type BaseSceneController } from 'mechanics/scenes/BaseSceneController'

// todo: refactor this weird class/ manager stuff
const store: Record<string, BaseSceneController<unknown>> = {}
const controllerTypes: Record<string, typeof BaseSceneController> = {}

export const registerSceneController = (questName: string, sceneName: string, controllerType: any) => {
  controllerTypes[`${questName}.${sceneName}`] = controllerType
}

/**
 * Gets the scenecontroller for scene. Creates it if it doesnt exist
 */
export const getSceneController = (questName: string, sceneName: string, store: Store<StoreState, AnyAction>): BaseSceneController<unknown> => {
  if (!store[`${questName}.${sceneName}`]) {
    if (!controllerTypes[`${questName}.${sceneName}`]) {
      throw new Error(`No controller registered for ${questName}.${sceneName}`)
    }
    store[`${questName}.${sceneName}`] = new controllerTypes[`${questName}.${sceneName}`](store, questName)
  }
  return store[`${questName}.${sceneName}`]
}

const destroySceneConroller = (questName: string, sceneName: string) => {
  delete store[`${questName}.${sceneName}`]
}

import { type Store } from 'redux'
import { type StoreState } from 'store/types'
import { type BaseSceneController } from 'mechanics/scenes/BaseSceneController'
import { type Action } from 'store/actions'

// todo: refactor this weird class/ manager stuff
const stores = new Map<string, BaseSceneController<unknown>>()
const controllerTypes: Record<string, typeof BaseSceneController> = {}

export const registerSceneController = (questName: string, sceneName: string, controllerType: any) => {
  controllerTypes[`${questName}.${sceneName}`] = controllerType
}

/**
 * Gets the scenecontroller for scene. Creates it if it doesnt exist
 */
export const getSceneController = (questName: string, sceneName: string, store: Store<StoreState, Action>): BaseSceneController<unknown> => {
  if (!stores.has(`${questName}.${sceneName}`)) {
    if (controllerTypes[`${questName}.${sceneName}`] == null) {
      throw new Error(`No controller registered for ${questName}.${sceneName}`)
    }
    stores.set(`${questName}.${sceneName}`, new controllerTypes[`${questName}.${sceneName}`](store, questName))
  }
  // we already asserted it's not null
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return stores.get(`${questName}.${sceneName}`)!
}

const destroySceneConroller = (questName: string, sceneName: string) => {
  stores.delete(`${questName}.${sceneName}`)
}

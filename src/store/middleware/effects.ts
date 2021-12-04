import { Effect, EffectType } from 'mechanics/effects/types'
import { Middleware, MiddlewareAPI, Dispatch } from 'redux'
import { Action } from 'store/actions'
import { StoreState } from 'store/types'
import { AdventurerStoreState } from 'store/types/adventurer'

type AppMiddlewareAPI = MiddlewareAPI<Dispatch<Action>, StoreState>
export const effectsMiddleware: Middleware<
  unknown, // Most middleware do not modify the dispatch return value
  StoreState
> = (storeApi: AppMiddlewareAPI) => next => (action: Action) => {
  const state = storeApi.getState()
  
  console.log('   middleware', action)
  for (const adventurer of state.adventurers) {
    (adventurer.effects ?? []).forEach(effect => {
      processEffect(effect, adventurer, action, storeApi)
      console.log(`${adventurer.name} has ${effect.type}`)
    })
  }
  // if (action.type === "enqueueSceneAction") {
    
  // }
  next(action);
}
const processEffect = (effect: Effect, adventurer: AdventurerStoreState, action: Action, storeApi: AppMiddlewareAPI) => {
  switch (effect.type) {
    case EffectType.brokenLegs: {
      const bla = "foo";
      console.log(adventurerJustWalked(adventurer, action, storeApi))
    }
  }
}

const adventurerJustWalked = (adventurer: AdventurerStoreState, action: Action, storeApi: AppMiddlewareAPI) => {
  if (action.type === "completeSceneAction") {
   // console.log("queue", storeApi.getState().)
  }
}

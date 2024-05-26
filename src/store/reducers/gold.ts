import { type GoldAction } from 'store/actions/gold'
import { type Reducer } from 'redux'
import lumberMill from 'definitions/structures/lumberMill'
import tavern from 'definitions/structures/tavern'
import { type StructuresAction } from 'store/actions/structures'
import { LODGE_COST } from 'mechanics/tavern'

export const initialGoldState = (lumberMill.cost.gold ?? 0) + (tavern.cost.gold ?? 0)
/**
 * reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line @typescript-eslint/default-param-last
export const gold: Reducer<number, GoldAction | StructuresAction> = (state = initialGoldState, action) => {
  switch (action.type) {
    case 'addGold': {
      // Adds (or subtract, if negative) gold from the players gold supply
      return state + action.amount
    }
    case 'lodgeWaitingAdventurer': {
      return state - LODGE_COST
    }
  }
  return state
}

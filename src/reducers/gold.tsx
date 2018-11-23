import { Reducer, AnyAction } from 'redux';

/**
 * reducer
 * @param state 
 * @param action 
 */
export const gold : Reducer<number> = (state:number = 200, action:AnyAction) => { // Todo: specify action
    // switch (action.type) {
    //     case SET_STRUCTURE_AMOUNT:
    //         if(state[action.structure] === undefined) return state;

    //         return { 
    //             ...state,                    
    //             [action.structure]: action.amount
    //         };                
    // } 
    return state;
}
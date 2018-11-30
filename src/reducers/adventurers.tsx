import { Reducer, Action } from 'redux';
import { AdventurerStoreState } from 'src/stores/adventurer';
import * as uuid from 'uuid/v1';

/**
 * reducer
 * @param state 
 * @param action 
 */

const testState:AdventurerStoreState[] = [{
    id: uuid(),
    name: "Ximena Maddox",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`
}, {
    id: uuid(),
    name: "Donte Houston",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`
}, {
    id: uuid(),
    name: "Zackary Morris",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`
}, {
    id: uuid(),
    name: "Mike Keith",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`
}];

export const adventurers : Reducer<AdventurerStoreState[]> = (state:AdventurerStoreState[] = testState, action:Action) => {
    return state;
}


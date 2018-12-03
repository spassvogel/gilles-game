import { Reducer, Action } from 'redux';
import { AdventurerStoreState, StatsStoreState } from 'src/stores/adventurer';
import * as uuid from 'uuid/v1';

/**
 * reducer
 * @param state 
 * @param action 
 */

 
const generateRandomStats = () : StatsStoreState => {
    return {
        strength: Math.random() * 100,
        perception: Math.random() * 100,
        endurance: Math.random() * 100,
        charisma: Math.random() * 100,
        intelligenge: Math.random() * 100,
        agility: Math.random() * 100,
        luck: Math.random() * 100
    }
};

const testState:AdventurerStoreState[] = [{
    id: uuid(),
    gear: {},
    stats: generateRandomStats(),
    name: "Ximena Maddox",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`
}, {
    id: uuid(),
    gear: {},
    stats: generateRandomStats(),
    name: "Donte Houston",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`
}, {
    id: uuid(),
    gear: {},
    stats: generateRandomStats(),
    name: "Zackary Morris",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`
}, {
    id: uuid(),
    gear: {},
    stats: generateRandomStats(),
    name: "Mike Keith",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`
}];



export const adventurers : Reducer<AdventurerStoreState[]> = (state:AdventurerStoreState[] = testState, action:Action) => {
    return state;
}


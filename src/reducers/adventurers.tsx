import { Reducer, Action } from 'redux';
import { AdventurerStoreState, StatsStoreState, GearStoreState } from 'src/stores/adventurer';
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


const generateRandomGear = (): GearStoreState => {
    
    const second = ["Burning Damnation", "Fury", "Some old guy", "the Depths", "Frozen Hells", "Broken bones", "the Claw", "Resilience", "Shattered Damnation", "the Seer" ];
    const combine = (first:Array<string>): string => {
        const firstPart = first[Math.floor(Math.random()*first.length)];
        const secondPart = second[Math.floor(Math.random()*second.length)];
        return `${firstPart} of ${secondPart}`;
    }
    return {
        arms: combine(["Fists", "Grips", "Hands", "Handguards", "Gauntlets"]),
        body: combine(["Breastplate", "Mithril Vest", "Titanium Armor", "Primitive Armor", "Scaled Raiment"]),
        feet: combine(["Sabatons", "Footguards", "Warboots", "Slippers"]),
        head: combine(["Helmet", "Headguard", "Obsidian Crown", "Scaled Hood"]),
    }


}


const testState:AdventurerStoreState[] = [{
    id: uuid(),
    gear: generateRandomGear(),
    stats: generateRandomStats(),
    name: "Ximena Maddox",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`
}, {
    id: uuid(),
    gear: generateRandomGear(),
    stats: generateRandomStats(),
    name: "Donte Houston",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`
}, {
    id: uuid(),
    gear: generateRandomGear(),
    stats: generateRandomStats(),
    name: "Zackary Morris",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`
}, {
    id: uuid(),
    stats: generateRandomStats(),
    gear: generateRandomGear(),
    name: "Mike Keith",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`
}];



export const adventurers : Reducer<AdventurerStoreState[]> = (state:AdventurerStoreState[] = testState, action:Action) => {
    return state;
}


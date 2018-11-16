import * as constants from '../constants';
import { Resources } from '../types';

export interface IncrementResource {
    type: constants.INCREMENT_RESOURCE;
    resource: string
}


//export type IncrementResource = IncrementResource // | others

export function incrementCrossbows(): IncrementResource {
    return {
        type: constants.INCREMENT_RESOURCE,
        resource: Resources.CROSSBOWS
    }
}
export function incrementLongbows(): IncrementResource {
    return {
        type: constants.INCREMENT_RESOURCE,
        resource: Resources.LONGBOWS
    }
}
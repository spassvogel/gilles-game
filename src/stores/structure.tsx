import { StructureType } from 'src/definitions/structures';

export interface StructureStoreState {
    level?: number,
    workers?: number
}
export const initialState:StructureStoreState = {
    level: 0,
    workers: 0
}
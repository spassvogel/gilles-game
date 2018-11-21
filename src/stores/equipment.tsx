export interface EquipmentStoreState {
    crossbows: number,
    longbows: number,
    swords: number,
    daggers: number,
    warPigs: number,
    torches: number
}
export const initialState:EquipmentStoreState = {
    crossbows: 0,
    daggers: 0,
    longbows: 0,
    swords: 0,
    warPigs: 0,
    torches: 0
}
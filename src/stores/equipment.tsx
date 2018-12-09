export interface EquipmentStoreState {
    crossbow: number;
    longbow: number;
    sword: number;
    dagger: number;
    warPig: number;
    khopesh: number;
    torch: number;
}
export const initialState: EquipmentStoreState = {
    crossbow: 1,
    dagger: 0,
    khopesh: 0,
    longbow: 0,
    sword: 0,
    torch: 0,
    warPig: 0,
};

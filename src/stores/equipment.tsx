// todo: refactor to items
export interface EquipmentStoreState {
    crossbow: number;
    longbow: number;
    sword: number;
    dagger: number;
    warPig: number;
    khopesh: number;
    torch: number;
    deedForWeaponsmith: number;
}
export const initialState: EquipmentStoreState = {
    crossbow: 1,
    dagger: 3,
    deedForWeaponsmith: 0,
    khopesh: 0,
    longbow: 1,
    sword: 4,
    torch: 0,
    warPig: 0,
};

import { AdventurerStoreState } from 'store/types/adventurer';

export function calculateInitialAp(adventurer: AdventurerStoreState): number {
    return adventurer.baseAP;
}
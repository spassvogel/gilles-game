import { AdventurerStoreState } from 'stores/adventurer';

export function calculateInitialAp(adventurer: AdventurerStoreState): number {
    return adventurer.baseAP;
}
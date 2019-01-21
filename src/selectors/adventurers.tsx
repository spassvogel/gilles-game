import { createSelector } from "reselect";
import { StoreState } from "src/stores";
import { AdventurerStoreState } from "src/stores/adventurer";
import { PartyStoreState } from "src/stores/party";

const getAdventurers = (state: StoreState): AdventurerStoreState[] => state.adventurers;
const getParties = (state: StoreState): Record<string, PartyStoreState> => state.parties;

const groupAdventurersByParty = (adventurers: AdventurerStoreState[], parties: Record<string, PartyStoreState>): Record<string, AdventurerStoreState[]> => {
    const foundInParty: AdventurerStoreState[] = []; // store the adventurers in parties in a temp array

    const adventurersInParty = (partyId: string): AdventurerStoreState[] => {
        const party: PartyStoreState = parties[partyId];
        return party.adventurers.map((id: string) => findAdventurerById(id)!);
    };

    const findAdventurerById = (id: string): AdventurerStoreState | undefined => {
        return adventurers.find((a) => a.id === id);
    }

    // Add up all the workers used by all structures in town
    const groupedAdventurers = Object.keys(parties).reduce((acc, val: string) => {
        acc[val] = adventurersInParty(val);
        foundInParty.push(...acc[val]);
        return acc;
    }, {});

    // Add a special group called 'solo' for those adventurers not in a party
    const soloKey = "solo";
    groupedAdventurers[soloKey] = adventurers.filter((a) => foundInParty.indexOf(a) === -1);

    return groupedAdventurers;
};

export const selectAdventurersGroupedByParty = createSelector([
    getAdventurers,
    getParties],
    groupAdventurersByParty,
);

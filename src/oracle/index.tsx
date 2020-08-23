import { adventurersOnQuest } from "storeHelpers";
import { StoreState } from "stores";
import { AdventurerStoreState } from "stores/adventurer";
import { QuestStoreState } from "stores/quest";
import { randomInt } from "utils/random";

/**
 * The Oracle is a helper class for retrieving relevant data during encounters
 */
export class Oracle {
    public readonly questName: string;
    public readonly store: StoreState;

    constructor(questName: string, store: StoreState) {
        this.questName = questName;
        this.store = store;
    }

    /**
     * Returns the questVars of the quest that this encounter is part of
     */
    public get questVars(): any {
        return this.quest.questVars;
    }

    /**
     * Returns the quest that this encounter is part of
     */
    public get quest(): QuestStoreState {
        return this.store.quests.find((q) => q.name === this.questName)!;
    }

    /**
     * Returns all adventurers on this quest
     */
    public get adventurers(): AdventurerStoreState[] {
        return adventurersOnQuest(this.store.adventurers, this.quest);
    }

    // /**
    //  * Returns the adventurer in the encounter with highest given stat
    //  * @param stat
    //  */
    // public getAdventurerWithHighest(stat: string): AdventurerStoreState { // todo: refactor 'stat' into enum
    //     return adventurersOnQuest(this.store.adventurers, this.quest)
    //         .concat().sort((a, b) => (b.stats[stat] - a.stats[stat]))[0];
    // }

    // /**
    //  * Returns the adventurer in the encounter with lowest given stat
    //  * @param stat
    //  */
    // public getAdventurerWithLowest(stat: string): AdventurerStoreState { // todo: refactor 'stat' into enum
    //     return adventurersOnQuest(this.store.adventurers, this.quest)
    //         .concat().sort((a, b) => (a.stats[stat] - b.stats[stat]))[0];
    // }

    /**
     * Returns a random adventurer in the party
     */
    public getRandomAdventurer(): AdventurerStoreState {
        return this.adventurers[randomInt(0, this.adventurers.length)];
    }
}

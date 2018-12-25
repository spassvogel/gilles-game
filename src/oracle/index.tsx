import { StoreState } from "src/stores";
import { AdventurerStoreState } from "src/stores/adventurer";
import { QuestStoreState } from "src/stores/quest";

/**
 * The Oracle is a helper class for retrieving relevant data during encounters
 */
export class Oracle<TQuestVars> {
    public readonly questName: string;
    public readonly store: StoreState;

    constructor(questName: string, store: StoreState) {
        this.questName = questName;
        this.store = store;
    }

    /**
     * Returns the questVars of the quest that this encounter is part of
     */
    public get questVars(): TQuestVars {
        return this.quest.questVars as unknown as TQuestVars;
    }

    /**
     * Returns the quest that this encounter is part of
     */
    public get quest(): QuestStoreState {
        return this.store.activeQuests.find((q) => q.name === this.questName)!;
    }

    /**
     * Returns the adventurer in the encounter with highest given stat
     * @param stat
     */
    public getAdventurerWithHighest(stat: string): AdventurerStoreState { // todo: refactor 'stat' into enum
        // todo: take from quest adventurers instead!
        return this.store.adventurers.concat().sort((a, b) => (b.stats[stat] - a.stats[stat]))[0];
    }

    /**
     * Returns the adventurer in the encounter with lowest given stat
     * @param stat
     */
    public getAdventurerWithLowest(stat: string): AdventurerStoreState { // todo: refactor 'stat' into enum
        // todo: take from quest adventurers instead!
        return this.store.adventurers.concat().sort((a, b) => (a.stats[stat] - b.stats[stat]))[0];
    }
}

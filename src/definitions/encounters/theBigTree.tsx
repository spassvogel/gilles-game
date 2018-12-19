// tslint:disable:object-literal-sort-keys
import { StoreState } from "src/stores";
import { EncounterDefinition } from "./types";

export interface QuestVars {
    treeState: string;
}

export const theBigTree: EncounterDefinition<QuestVars> = {
    getTitle: (questVars: QuestVars, store: StoreState) => "The big tree",
    getDescription: (questState: QuestVars, store: StoreState) => {
        // const pyromancer = store.adventurers.find((a) => a.name === "pyromancer");
        // if (pyromancer) {
        //     return `A huge tree blocks the way. ${pyromancer.name} offers to burn it`;
        // }
        return "A huge tree blocks the way";
    },
    getOptions: (questState: QuestVars, store: StoreState) => {
        //const strongest = store.adventurers.sort((a) => a.stats.strength)[0];
        const strongest = { name: "<<NAME>>" };
        const options: Record<string, string> = {
            walkAround: "Walk around the tree",
            lift: `Lift the tree (${strongest.name})`,
        };
        // todo: should be 'type' or 'class'
        // const pyromancer = store.adventurers.find((a) => a.name === "pyromancer");
        // if (pyromancer) {
        //     options.burn = "Burn it down (${pyromancer.name}";
        // }
        return options;
    },
};

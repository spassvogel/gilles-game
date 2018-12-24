// tslint:disable:object-literal-sort-keys
import { StoreState } from "src/stores";
import { EncounterDefinition } from "./types";

export interface QuestVars {
    treeState: string;
}

export const theBigTree: EncounterDefinition<QuestVars> = {
    getTitle: (questVars: QuestVars, store: StoreState) => "The big tree",
    getDescription: (questVars: QuestVars, store: StoreState) => {
        // const pyromancer = store.adventurers.find((a) => a.name === "pyromancer");
        // if (pyromancer) {
        //     return `A huge tree blocks the way. ${pyromancer.name} offers to burn it`;
        // }
        return "A huge tree blocks the way";
    },
    getOptions: (questVars: QuestVars, store: StoreState) => {
        const strongest = store.adventurers.concat().sort((a) => a.stats.strength)[0];
//        const strongest = { name: "<<NAME>>" };
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
    answer: (option: string, questVars: QuestVars, store: StoreState) => {
        switch (option) {
            case "walkAround":
                return "Your party walks around the tree";

            case "lift":
                const strongest = store.adventurers.concat().sort(a => a.stats.strength)[0];
                questVars.treeState = "lifted";
                // tslint:disable-next-line:max-line-length
                return `${strongest.name} heaves and lifts the heavy tree, moving it aside. Underneath your party finds 3 gold coins`;

                // if(random() < strongest.stats.strenth) {
                //     questState.bigTreeState = "lifted";
                //     giveGold(3);
                //     return "${strongest.name} heaves and lifts the heavy tree, moving it aside. Underneath your party finds 3 gold coins";
                // }
                // else {
                //     strongest.loseHealth(20);
                //     if(strongest.isDead){
                //         return "${strongest.name} attempted to lift the tree but it is too heavy, causing him to die".
                //     }
                //     return "%{strongest.name} attempted to lift the tree but it is too heavy, losing 20 hp";
                // }
            // case "burn":
            //     const pyrommancer = store.adventurers.find(a => a.type == "pyromancer")
            //     questState.bigTreeState = "burned";
            //     return "${pyromancer.name} cackles as you sets the tree ablaze. The party steps over the smouldering ashes and continues"
            // }
            default:
                throw new Error(`Unhandled option ${option}`);
        }
    }
};

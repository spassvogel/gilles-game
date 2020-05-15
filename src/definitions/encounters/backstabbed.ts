export const foo = false;
// // tslint:disable:object-literal-sort-keys
// import { addItemToInventory } from "actions/adventurers";
// import { Oracle } from "oracle";
// import { AnyAction, Dispatch } from "redux";
// import { StoreState } from "stores";
// import { Item } from "../items/types";
// import { Encounter, EncounterDefinition } from "./types";

// // tslint:disable-next-line:no-empty-interface
// export interface QuestVars {
// }

// export const backstabbed: EncounterDefinition = {
//     name: Encounter.backstabbed,
//     getOracle: (questName: string, store: StoreState) => {
//         return new Oracle(questName, store);
//     },
//     getDescription: (oracle: Oracle) => {
//         return { key: "encounter-backstabbed-description" };
//     },
//     getOptions: (oracle: Oracle) => {
//         const options: Record<string, string> = {
//             fight: "Fight the brigands",
//             flight: "Run away!",
//         };
//         return options;
//     },
//     answer: (option: string, oracle: Oracle, dispatch: Dispatch<AnyAction>) => {
//         switch (option) {
//             case "flight":
//                 return "You run away like a pussy";
//             case "fight":
//                 const finder = oracle.getRandomAdventurer();
//                 dispatch(addItemToInventory(finder.id, Item.deedForWeaponsmith));
//                 return `The party fights off the rogues. One of them drops a document. ${finder.name} picks it up`;
//             default:
//                 throw new Error(`Unhandled option '${option}`);
//         }
//     },
// };

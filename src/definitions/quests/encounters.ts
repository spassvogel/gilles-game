// import { Store, AnyAction } from "redux";
// import { SceneStoreStat } from 'stores/scene';
// import { StoreState } from 'stores';
// import { TiledMapData } from 'constants/tiledMapData';
// import { ExtendedTiledObjectData } from 'utils/tilemap';
// import { AdventurerStoreState } from 'stores/adventurer';
// // todo: obsolete
// export interface EncounterDefinition<TQuestVars> {
//     startScene(store: Store<StoreState, AnyAction>, questName: string, sceneName?: string): void
//     createScene(store: StoreState, tilemap: string, tilemapData: TiledMapData, questName: String, questVars: TQuestVars): SceneStoreState

//     // getOracle: (questName: string, store: StoreState) => Oracle;
//     // chance?: number;    // number from 0 to 1, undefined means: 1
//     // getDescription: (oracle: Oracle) => TextEntry;
//     // getOptions: (oracle: Oracle) => Record<string, string>;
//     // answer: (option: string, oracle: Oracle, dispatch: Dispatch<AnyAction>) => string;
// }

// export const createActors = (tilemapObjects: { [key: string]: ExtendedTiledObjectData }, adventurers: AdventurerStoreState[]) => {
//     const startLocations = Object.values(tilemapObjects)
//         .filter(o => o.ezProps?.adventurerStart)
//         .map(o => o.location);
//     if (adventurers.length > startLocations.length) {
//         throw new Error("Not enough objects with 'adventurerStart' property set to true");
//     }
//     return adventurers.reduce((acc: SceneObject[], value: AdventurerStoreState, index: number) => {
//         const location = startLocations[index];
//         acc.push({
//             type: "actor",
//             health: 100,
//             location,
//             name: value.id,
//         })
//         return acc;
//     }, []);
// }
export const foo = "bar";
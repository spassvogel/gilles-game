import axios from "axios";
import * as React from "react";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Persistor } from "redux-persist";
import { State as seedrandomStateType } from "seedrandom";
import { gameTick } from "./actions/game";
import { addLogEntry } from "./actions/log";
import version from "./constants/version";
import App from "./containers/App";
import structureDefinitions from "./definitions/structures";
import { ResourceStructureDefinition,
    ResourceStructureLevelDefinition, StructureDefinition, StructureType } from "./definitions/structures/types";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { StoreState } from "./stores";
import { ResourceStoreState } from "./stores/resources";
import { StructuresStoreState } from "./stores/structures";
import { TaskStoreState } from "./stores/task";
import { TasksStoreState } from "./stores/tasks";
import configureStore from "./utils/configureStore";
import * as Random from "./utils/random";
import { TextManager } from "./utils/textManager";

let interval: NodeJS.Timeout;
const initGame = async () => {
    const axiosResult = await axios.get("lang/en-US.json");
    const texts = axiosResult.data as Record<string, string>;
    TextManager.init(texts);
    Random.init("GILLESROX2");

    const { store, persistor, isHydrated } = await configureStore();
    if (!isHydrated) {
        startNewGame(store);
    } else {
        continueGame(store);
    }
    runGame(store, persistor);
};

/**
 * Gets called when a player
 * @param store
 */
const startNewGame = (store: any) => {

    store.dispatch(addLogEntry("test-game-welcome"));
    // todo: here is a good place to launch a tutorial or something

    // tslint:disable-next-line:no-console
    console.log(`Starting new GILLES-IDLE-GAME (version ${version})`);
};

const continueGame = (store: any) => {
    // tslint:disable-next-line:no-console
    console.log(`Continuing existing GILLES-IDLE-GAME (version ${version})`);
};

const stopGame = () => {
    clearTimeout(interval);
};

const runGame = (store: any, persistor: Persistor) => {
    ReactDOM.render(
        <Provider store={store}>
            <DragDropContextProvider backend={ HTML5Backend }>
                <App persistor={ persistor }/>
            </DragDropContextProvider>
        </Provider>,
        document.getElementById("root") as HTMLElement,
    );
    registerServiceWorker();

    // TODO: Check HMR: https://github.com/wmonk/create-react-app-typescript/pull/312#issuecomment-385617913

    const processCompletedTasks = (tasks: TasksStoreState) => {
        const handleCompletedTask = (task: TaskStoreState) => {
            // Fire all callbacks
            task.callbacks.forEach((action) => store.dispatch(action));
        };

        tasks.completed.forEach((task) => handleCompletedTask(task));
    };

    // TODO: place these 'controllers' somewhere else

    /*
    * Will generate resources based on the structures in the town.
    * Will return a ResourceStoreState with the amount of each resource to add  */
    const getProducedResources = (delta: number, structures: StructuresStoreState) => {
        const result: ResourceStoreState = {};
        const resourceInterval = 60000; // every minute constitutes a resource tick. todo: move to some other shared place
        const factor = delta / resourceInterval;
        // this function can run at different intervals
        // faster or slower than once a minute
        // we will multiply the resource amount by the factor to normalize

        const handleStructure = (structure: string) => {
            const structureDefinition: StructureDefinition = structureDefinitions[structure];

            switch (structureDefinition.type) {
                case StructureType.resource:
                    const resourceStructureDefinition = structureDefinition as ResourceStructureDefinition;
                    const level: number = structures[structure].level;
                    const levelDefinition: ResourceStructureLevelDefinition = resourceStructureDefinition.levels[level];

                    // Store all the resources that this structure will generate this tick into `result`
                    Object.keys(levelDefinition.generates).reduce((accumulator: ResourceStoreState, resource: string) => {
                        const amount: number = levelDefinition.generates[resource] * structures[structure].workers * factor;
                        accumulator[resource] = (accumulator[resource] || 0) + amount;
                        return accumulator;
                    }, result);
                    break;
            }
        };

        Object.keys(structures).forEach((structure) => handleStructure(structure));
        return result;
    };
/*
    const getQuestUpdates = (delta: number, quests: QuestStoreState[]) => {
        // Moves the quest line progress. Only if currently at a 'nothing' node
        // Otherwise the user has to do something to move the quest along

        const speed = 4;    // in nodes per minute
        const MS_PER_MINUTE = 60000;

        return quests.map((qss) => {
            const questDefinition: QuestDefinition = questDefinitions[qss.name];
            const currentProgress = qss.progress;

            const currentNode = questDefinition.nodes[Math.floor(currentProgress)];

            if (currentNode.type === QuestNodeType.nothing) {
                // Currently at a 'nothing' node
                const progressIncrease = (action.delta / MS_PER_MINUTE) * speed;
                const currentNodeIndex =  Math.floor(currentProgress);
                let nextProgress = Math.min(currentProgress + progressIncrease, questDefinition.nodes.length - 1);
                const hops = Math.floor(nextProgress) - currentNodeIndex;

                let log = qss.log;
                let currentEncounter = qss.currentEncounter;

                for (let i = 0; i < hops; i++) {
                    // Loop through all the nodes we've passed since last tick
                    const nextNode = questDefinition.nodes[currentNodeIndex + i];
                    if (nextNode.type === QuestNodeType.encounter) {
                        // We've hit an encounter node. set the progress to here and stop looking at other nodes
                        const encounter = encounterDefintions[nextNode.encounter!];
                        const oracle = oracles[qss.name];
                        nextProgress = currentNodeIndex + i;
                        log = [
                            ...log,
                            encounter.getDescription(oracle),
                        ];
                        currentEncounter = nextNode.encounter!;
                        // Start encounter(encounter)
                        // TODO: How to dispatch an action from a reducer?
                        // OR: move this logic outside of reducer
                        break;
                    } else if (nextNode.type === QuestNodeType.nothing) {
                        currentEncounter = null;
                        if (nextNode.log) {
                            log = [
                                ...log,
                                nextNode.log,
                            ];
                        }
                    }
                }

                return {
                    ...qss,
                    currentEncounter,
                    progress: nextProgress,
                    log,
                };
            }
            return qss;
        });
    }; */
    // store.dispatch(addGold(400));

    // TODO: find something less ugly and hacky than this
//    oracles.kill10b = theBigTree.getOracle("kill_10_boars", store);
  //  oracles["retrieve_magic_amulet"] = backstabbed.getOracle("retrieve_magic_amulet", store);

    const getRngState = (): seedrandomStateType | null => {
        if (Random.dirty) {
            return Random.state();
        }
        return null;
    };

    const gameLoop = () => {
        const state: StoreState = store.getState();
        const delta = Date.now() - state.engine.lastTick;

        const resources = getProducedResources(delta, state.structures);
        const rngState = getRngState();
        store.dispatch(gameTick(delta, rngState, resources));

        processCompletedTasks(state.tasks);

        // store.dispatch(addLogEntry("test-you-have-found-an-item", { item: "sword" }));

    };

    interval = setInterval(gameLoop, 2500);
};

initGame();

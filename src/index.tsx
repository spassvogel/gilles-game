import axios from "axios";
import * as React from "react";
import HTML5Backend from "react-dnd-html5-backend";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Persistor } from "redux-persist";
import { gameTick } from "./actions/game";
import { addLogEntry } from "./actions/log";
import version from "./constants/version";
import App from "./containers/App";
import "./index.css";
import getProducedResources from "./mechanics/gameTick/producedResources";
import getQuestUpdates from "./mechanics/gameTick/quests";
import getRngState from "./mechanics/gameTick/rngState";
import registerServiceWorker from "./registerServiceWorker";
import { StoreState } from "./stores";
import { TaskStoreState } from "./stores/task";
import { TasksStoreState } from "./stores/tasks";
import configureStore from "./utils/configureStore";
import * as Random from "./utils/random";
import { TextManager } from "./utils/textManager";
import { DndProvider } from "react-dnd";

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
            <DndProvider backend={ HTML5Backend }>
                <App persistor={ persistor }/>
            </DndProvider>
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

    // store.dispatch(addGold(400));

    // TODO: find something less ugly and hacky than this
//    oracles.kill10b = theBigTree.getOracle("kill_10_boars", store);
  //  oracles["retrieve_magic_amulet"] = backstabbed.getOracle("retrieve_magic_amulet", store);
    const gameLoop = () => {
        const state: StoreState = store.getState();
        const delta = Date.now() - state.engine.lastTick;

        const resourcesUpdates = getProducedResources(delta, state);
        const rngState = getRngState();
        const { quests, log } = getQuestUpdates(delta, state);
        store.dispatch(gameTick(delta, rngState, resourcesUpdates, quests, log));

        processCompletedTasks(state.tasks);

        // store.dispatch(addLogEntry("test-you-have-found-an-item", { item: "sword" }));

    };

    interval = setInterval(gameLoop, 2500);
};

initGame();

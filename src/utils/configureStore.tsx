import { createStore, DeepPartial } from "redux";
import { Persistor, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { asInt } from "src/constants/version";
import rootReducer from "src/reducers/index";
import { StoreState } from "src/stores";
import { convertIntToSemVer } from "./version";

const persistConfig = {
    key: "root",
    storage,
    version: asInt,
};

console.log(convertIntToSemVer(asInt));
const persistedReducer = persistReducer(persistConfig, rootReducer);

interface StoreAndPersistor {
    store: any;
    persistor: Persistor;
}
/**
 * Configures the redux store
 */
export default (initial: DeepPartial<StoreState> = {}): StoreAndPersistor => {
    const store = createStore<StoreState, any, any, any>(
        persistedReducer,
        initial,
        (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
    );
    const persistor = persistStore(store);
    return { store, persistor };
};

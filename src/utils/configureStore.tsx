import { createStore, DeepPartial } from "redux";
import { Persistor, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { asInt } from "src/constants/version";
import rootReducer from "src/reducers/index";
import { storeIsRehydrated } from "src/storeHelpers";
import { StoreState } from "src/stores";
import { convertIntToSemVer } from "./version";

const persistConfig = {
    key: "root",
    storage,
    version: asInt,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

interface ConfigureStoreResult {
    store: any;
    persistor: Persistor;
    isHydrated: boolean;
}
/**
 * Configures the redux store
 */
export default async (initial: DeepPartial<StoreState> = {}): Promise<ConfigureStoreResult> => {
    return new Promise((resolve, reject) => {
        const store = createStore<StoreState, any, any, any>(
            persistedReducer,
            initial,
            (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
        );
        const persistor = persistStore(store, undefined, () => {
            const isHydrated = storeIsRehydrated(store.getState());
            resolve({ store, persistor, isHydrated }) ;
        });
    });
};

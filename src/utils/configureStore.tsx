import { asInt } from "constants/version";
import rootReducer from "reducers/index";
import { createStore, DeepPartial } from "redux";
import { Persistor, persistReducer, persistStore, PersistPartial } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { storeIsRehydrated } from "storeHelpers";
import { StoreState } from "stores";
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
        // todo: first type should not be any, should be StoreState
        const store = createStore<StoreState & PersistPartial, any, any, StoreState>(
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

import { createStore, DeepPartial, AnyAction } from "redux";
import { Persistor, persistReducer, persistStore } from "redux-persist";
import localForage from 'localforage';
import { PersistPartial } from 'redux-persist/lib/persistReducer';
import rootReducer from "store/reducers/index";
import { asInt } from "constants/version";
import { storeIsRehydrated } from 'store/helpers/storeHelpers';
import { StoreState } from 'store/types';

const persistConfig = {
    key: "root",
    storage: localForage,
    version: asInt,
};

const persistedReducer = persistReducer<StoreState, AnyAction>(persistConfig, rootReducer);

interface ConfigureStoreResult {
    store: any;
    persistor: Persistor;
    isHydrated: boolean;
}

/**
 * Configures the redux store
 */
const configureStore = async (initial: DeepPartial<StoreState> = {}): Promise<ConfigureStoreResult> => {
    return new Promise((resolve, reject) => {
        const store = createStore<StoreState & PersistPartial, AnyAction, any, StoreState>(
            persistedReducer,
            // @ts-ignore
            initial,
            (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
        );
        const persistor = persistStore(store, undefined, () => {
            const isHydrated = storeIsRehydrated(store.getState());
            resolve({ store, persistor, isHydrated }) ;
        });
    });
};

export default configureStore;
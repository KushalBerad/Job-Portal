import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from "./jobSlice";
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// 🚀 Security Win: Isolate administrative data slices from long-term browser storage caches
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth'], // 🔥 FIXED: ONLY persist authentication sessions. 'job', 'company', and 'application' data will reload fresh on mount!
};

const appReducer = combineReducers({
    auth: authSlice,
    job: jobSlice,
    company: companySlice,
    application: applicationSlice
});

// 🔥 FIXED: Foolproof Root Interceptor to instantly wipe out all memory caches and localStorage tokens upon logout
const rootReducer = (state, action) => {
    // Check if the dispatched action type corresponds to a user logging out
    if (action.type === 'auth/purgeSessionState' || action.type === 'auth/setUser' && action.payload === null) {
        // Completely drop localStorage keys securely
        storage.removeItem('persist:root');
        // Force Redux to clear the entire state tree down to pristine defaults
        state = undefined;
    }
    return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store); // Export persistor instance for App.jsx wrapper integration
export default store;

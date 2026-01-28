'use client'

import { useMemo } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import userReducer from './features/users/userSlice'
import themeReducer from "./features/theme/themeSlice";
import { api } from "./services/api";
import { setupListeners } from "@reduxjs/toolkit/query";

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/* 
 * REDUX PERSISTENCE CONFIGURATION 
 * This section handles saving the Redux state to localStorage so it persists across page reloads.
 */

// Create a "noop" storage for server-side rendering (SSR) where window is not available.
// This prevents errors during the Next.js build process or SSR.
const createNoopStorage = () => {
    return {
        getItem(_key: string) {
            return Promise.resolve(null);
        },
        setItem(_key: string, value: string) {
            return Promise.resolve(value);
        },
        removeItem(_key: string) {
            return Promise.resolve();
        },
    };
};

// Select the storage engine: 'local' (localStorage) for client-side, 
// or 'noop' for server-side.
const storage =
    typeof window === "undefined"
        ? createNoopStorage()
        : createWebStorage("local");

// Configuration for redux-persist
const persistConfig = {
    key: "root", // The key for the root of the state in storage
    storage,     // The storage engine to use
    whitelist: ["theme", "users"], // Only these slices of state will be persisted
    // 'api' (RTK Query) is typically not persisted as it has its own caching mechanism
};

// Combine all reducers into a root reducer
// - user: Manages user authentication and profile data
// - theme: Manages UI theme (light/dark mode)
// - api: Manages RTK Query API cache and state
const rootReducer = combineReducers({
    users: userReducer,
    theme: themeReducer,
    [api.reducerPath]: api.reducer,
});

// Wrap the root reducer with persistReducer to enable persistence capabilities
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* 
 * REDUX STORE CREATION
 * Function to create a new store instance. 
 * This is wrapped in a function to ensure a new store is created per request on the server if needed,
 * though primarily used in the client component here.
 */
export const makeStore = () => {
    return configureStore({
        reducer: persistedReducer,
        middleware: (getDefault) =>
            getDefault({
                serializableCheck: {
                    // Ignore these specific redux-persist actions in serializable check
                    // because they may contain non-serializable data (like functions)
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }).concat(api.middleware), // Add RTK Query middleware
    });
};

/* REDUX TYPES */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

/* 
 * PROVIDER COMPONENT
 * This component wraps the application to provide the Redux store to all components.
 * It ensures the store is only created once per client session using useRef.
 */
export default function StoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // useMemo ensures the store instance is created only once
    // Empty dependency array means this only runs on initial mount
    const store = useMemo(() => {
        const newStore = makeStore();
        // Setup RTK Query listeners (e.g., for refetchOnFocus)
        setupListeners(newStore.dispatch);
        return newStore;
    }, []);

    // Create the persistor once the store is initialized
    // useMemo ensures persistor is only created once
    const persistor = useMemo(() => persistStore(store), [store]);

    return (
        <Provider store={store}>
            {/* PersistGate delays rendering until the persisted state is retrieved */}
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import walletReducer from './wallet/slice';
import assetsReducer from './assets/slice';
import swapRoutesReducer from './swapRoutes/slice';
import routeHistoryReducer from './routeHistory/slice';
import settingsReducer from './settings/settingsSlice';

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['wallet', 'assets', 'settings'],
	blacklist: ['swapRoutes', 'routeHistory'],
};

const rootReducer = combineReducers({
	wallet: walletReducer,
	assets: assetsReducer,
	swapRoutes: swapRoutesReducer,
	routeHistory: routeHistoryReducer,
	settings: settingsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
				ignoredPaths: ['payload'],
			},
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
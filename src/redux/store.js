import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./slices/counterSlice";
import {
  injectedMiddleware,
  injectedMiddlewareInstance,
} from "./utils/middleware-manager";
import { createReducerManager } from "./utils/reducer-manager";

export const staticReducers = {
  counter: counterSlice.reducer,
};

const createStore = () => {
  const store = configureStore({
    reducer: staticReducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(injectedMiddleware),
  });

  const reducerManager = createReducerManager(store, staticReducers);

  store.injectReducer = reducerManager.add;
  store.injectMiddleware = injectedMiddlewareInstance.add;

  return store;
};

export const store = createStore();

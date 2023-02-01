import { combineReducers } from "@reduxjs/toolkit";

export const createReducerManager = (store, initialReducers) => {
  const reducers = { ...initialReducers };
  let keysToRemove = [];

  const add = (reducer) => {
    store.replaceReducer(combineReducers({ ...initialReducers, ...reducer }));
  };

  const remove = (key) => {
    if (!reducers[key]) {
      return;
    }

    delete reducers[key];
    keysToRemove.push(key);
    store.replaceReducer(combineReducers(reducers));
  };

  return {
    add,
    remove,
  };
};

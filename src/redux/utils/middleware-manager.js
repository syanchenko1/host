import { compose } from "@reduxjs/toolkit";

export const createInjectedMiddleware = () => {
  let allMiddleware = [];
  let allInjectedMiddleware = [];
  let middlewareAPI;

  const enhancer = (api) => {
    middlewareAPI = api;
    return (next) => (action) =>
      compose(...allInjectedMiddleware)(next)(action);
  };

  const add = (...asyncMiddleware) => {
    allInjectedMiddleware.push(
      ...asyncMiddleware.map((middleware) => middleware(middlewareAPI))
    );
    allMiddleware.push(...asyncMiddleware);
  };

  const remove = (middleware) => {
    const index = allMiddleware.findIndex((m) => m === middleware);

    if (index === -1) {
      return;
    }

    allMiddleware = allMiddleware.filter((_, i) => i !== index);
    allInjectedMiddleware = allInjectedMiddleware.filter((_, i) => i !== index);
  };

  return {
    enhancer,
    add,
    remove,
  };
};

export const injectedMiddlewareInstance = createInjectedMiddleware();
export const injectedMiddleware = injectedMiddlewareInstance.enhancer;
export const middlewareManager = injectedMiddlewareInstance;

const isFn = (fn, message) => {
  if (typeof fn !== "function") throw new Error(message);
};

export const createStore = (reducer, defaultState) => {
  isFn(reducer, "Reducer must be a function");

  let handleState = reducer;
  let state = defaultState || handleState(undefined, {});
  let handlers = [];

  const getState = () => state;
  const subscribe = cb => {
    isFn(cb, "Subscription callback must be a function");

    handlers = [...handlers, cb];

    return () => {
      handlers = handlers.filter(handler => handler !== cb);
    };
  };
  const dispatch = action => handlers.forEach(handler => handler(action));
  const replaceReducer = cb => {
    isFn(cb, "Reducer must be a function");

    handleState = cb;
  };

  subscribe(action => (state = handleState(state, action)));

  return {
    getState,
    subscribe,
    dispatch,
    replaceReducer
  };
};

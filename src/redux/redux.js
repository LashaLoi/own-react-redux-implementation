export const createStore = (reducer, defaultState) => {
  if (!reducer) throw new Error("Reducer is not exist");
  if (typeof reducer !== "function")
    throw new Error("Reducer must be a function");

  let handleState = reducer;
  let state = defaultState || handleState(defaultState, {});
  let handlers = [];

  const getState = () => state;
  const subscribe = cb => {
    if (typeof cb !== "function")
      throw new Error("Subscription callback must be a function");

    handlers = [...handlers, cb];

    return () => (handlers = handlers.filter(handlers => handlers !== cb));
  };
  const replaceReducer = nextReducer => {
    if (typeof nextReducer !== "function")
      throw new Error("Reducer must be a function");

    handleState = nextReducer;
  };
  const dispatch = dispatch => handlers.forEach(handler => handler(dispatch));

  subscribe(dispatch => (state = handleState(state, dispatch)));

  return {
    getState,
    dispatch,
    replaceReducer,
    subscribe
  };
};

import { createStore } from "./redux";

const defaultState = { count: 0 };

const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

const reducer = (state, action) => {
  switch (action.type) {
    case INCREMENT:
      return {
        count: state.count + 1
      };
    case DECREMENT:
      return {
        count: state.count - 1
      };
    default:
      return state;
  }
};

describe("test store", () => {
  describe("test passing params", () => {
    it("test store without reducer", () => {
      try {
        createStore();
      } catch ({ message }) {
        expect(message).toEqual("Reducer is not exist");
      }
    });

    it("test store with default state", () => {
      const { getState } = createStore(reducer, defaultState);

      expect(getState()).toEqual(defaultState);
    });

    it("test not valid reducer", () => {
      try {
        createStore({});
      } catch ({ message }) {
        expect(message).toEqual("Reducer must be a function");
      }
    });

    it("test store with default state in reducer", () => {
      const { getState } = createStore((state = defaultState) => state);

      expect(getState()).toEqual(defaultState);
    });
  });

  describe("test getState", () => {
    it("test using getState without anything", () => {
      const { getState } = createStore(() => {});

      expect(getState()).toEqual(undefined);
    });

    it("test defaultState", () => {
      const { getState } = createStore(() => {}, 1);

      expect(getState()).toEqual(1);
    });

    it("test defaultState in reducer", () => {
      const { getState } = createStore((state = defaultState) => state);

      expect(getState()).toEqual(defaultState);
    });

    it("test getState after dispatch", () => {
      const { getState, dispatch } = createStore(reducer, defaultState);

      expect(getState()).toEqual(defaultState);

      dispatch({
        type: INCREMENT
      });

      expect(getState()).toEqual({
        count: 1
      });
    });
  });

  describe("test replaceReducer", () => {
    it("test using replaceReducer", () => {
      const { replaceReducer, dispatch, getState } = createStore(reducer);

      replaceReducer(() => 1);
      dispatch({});

      expect(getState()).toEqual(1);
    });

    it("test not valid replaceReducer", () => {
      const { replaceReducer } = createStore(reducer);

      try {
        replaceReducer(null);
      } catch ({ message }) {
        expect(message).toEqual("Reducer must be a function");
      }
    });
  });

  describe("test dispatch", () => {
    it("test single dispatch", () => {
      const { getState, dispatch } = createStore(reducer, defaultState);

      expect(getState()).toEqual(defaultState);

      dispatch({
        type: INCREMENT
      });

      expect(getState()).toEqual({ count: 1 });
    });

    it("test double dispatch", () => {
      const { getState, dispatch } = createStore(reducer, defaultState);

      expect(getState()).toEqual(defaultState);

      dispatch({
        type: INCREMENT
      });
      dispatch({
        type: INCREMENT
      });

      expect(getState()).toEqual({ count: 2 });
    });

    it("test different types of dispatch", () => {
      const { getState, dispatch } = createStore(reducer, defaultState);

      expect(getState()).toEqual(defaultState);

      dispatch({
        type: INCREMENT
      });
      dispatch({
        type: DECREMENT
      });
      dispatch({
        type: INCREMENT
      });

      expect(getState()).toEqual({ count: 1 });
    });

    it("test dispatch without type field", () => {
      const { getState, dispatch } = createStore(reducer, defaultState);

      expect(getState()).toEqual(defaultState);

      dispatch({});

      expect(getState()).toEqual({ count: 0 });
    });

    it("test dispatch calls", () => {
      const { getState, dispatch } = createStore(reducer, defaultState);

      const callCount = Array(10);

      expect(getState()).toEqual(defaultState);

      for (let i = 0; i < callCount.length; i++) {
        dispatch({ type: INCREMENT });
      }

      expect(getState()).toEqual({ count: callCount.length });
    });

    it("test a lot of dispatch calls", () => {
      const { getState, dispatch } = createStore(reducer, defaultState);

      const callCount = Array(1000000);

      expect(getState()).toEqual(defaultState);

      for (let i = 0; i < callCount.length; i++) {
        dispatch({ type: INCREMENT });
      }

      expect(getState()).toEqual({ count: callCount.length });
    });
  });

  describe("test subscribe", () => {
    it("test using subscribe", () => {
      const callback = jest.fn();

      const { dispatch, subscribe } = createStore(reducer, defaultState);

      subscribe(callback);

      dispatch({});

      expect(callback.mock.calls.length).toBe(1);
    });

    it("test using subscribe with 2 dispatch", () => {
      const callback = jest.fn();

      const { dispatch, subscribe } = createStore(reducer, defaultState);

      subscribe(callback);

      dispatch({});
      dispatch({});

      expect(callback.mock.calls.length).toEqual(2);
    });

    it("test using double subscribe ", () => {
      const firstCallback = jest.fn();
      const secondCallback = jest.fn();

      const { dispatch, subscribe } = createStore(reducer, defaultState);

      subscribe(firstCallback);
      subscribe(secondCallback);

      dispatch({});

      expect(firstCallback.mock.calls.length).toBe(1);
      expect(secondCallback.mock.calls.length).toBe(1);
    });

    it("test unsubscribe ", () => {
      const callback = jest.fn();

      const { dispatch, subscribe } = createStore(reducer, defaultState);

      const unsubscribe = subscribe(callback);

      dispatch({});

      expect(callback.mock.calls.length).toBe(1);

      unsubscribe();

      dispatch({});

      expect(callback.mock.calls.length).toBe(1);
    });

    it("test 2 unsubscribes ", () => {
      const firstCallback = jest.fn();
      const secondCallback = jest.fn();

      const { dispatch, subscribe } = createStore(reducer, defaultState);

      const firstUnsubscribe = subscribe(firstCallback);
      const secondUnsubcribe = subscribe(secondCallback);

      dispatch({});

      expect(firstCallback.mock.calls.length).toBe(1);

      firstUnsubscribe();

      dispatch({});

      expect(secondCallback.mock.calls.length).toBe(2);

      secondUnsubcribe();

      expect(secondCallback.mock.calls.length).toBe(2);
    });

    it("test invalid subscribes ", () => {
      const { subscribe } = createStore(reducer, defaultState);

      try {
        subscribe(null);
      } catch ({ message }) {
        expect(message).toBe("Subscription callback must be a function");
      }
    });
  });

  describe("test sequence", () => {
    it("test getState with dispatch with subscribe", () => {
      const callback = jest.fn();

      const { getState, dispatch, subscribe } = createStore(
        reducer,
        defaultState
      );

      expect(getState()).toEqual(defaultState);

      subscribe(callback);

      expect(callback.mock.calls.length).toEqual(0);

      dispatch({
        type: INCREMENT
      });

      expect(callback.mock.calls.length).toEqual(1);
      expect(getState()).toEqual({ count: 1 });
    });

    it("test getState with dispatch with subscribe (unsubscribe)", () => {
      const callback = jest.fn();

      const { getState, dispatch, subscribe } = createStore(
        reducer,
        defaultState
      );

      expect(getState()).toEqual(defaultState);

      const unsubscribe = subscribe(callback);

      expect(callback.mock.calls.length).toEqual(0);

      dispatch({
        type: INCREMENT
      });

      expect(callback.mock.calls.length).toEqual(1);
      expect(getState()).toEqual({ count: 1 });

      unsubscribe();

      dispatch({
        type: INCREMENT
      });

      expect(callback.mock.calls.length).toEqual(1);
    });

    it("test getState with dispatch with subscribe (unsubscribe) with replaceReducer", () => {
      const callback = jest.fn();

      const { getState, dispatch, subscribe, replaceReducer } = createStore(
        reducer,
        defaultState
      );

      expect(getState()).toEqual(defaultState);

      const unsubscribe = subscribe(callback);

      expect(callback.mock.calls.length).toEqual(0);

      dispatch({
        type: INCREMENT
      });

      expect(callback.mock.calls.length).toEqual(1);
      expect(getState()).toEqual({ count: 1 });

      unsubscribe();

      dispatch({
        type: INCREMENT
      });

      expect(callback.mock.calls.length).toEqual(1);

      replaceReducer(() => 1);

      dispatch({
        type: INCREMENT
      });

      expect(getState()).toEqual(1);
    });
  });
});

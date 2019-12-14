import { createStore } from "./redux";

const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

export const increment = () => ({
  type: INCREMENT
});

export const decrement = () => ({
  type: DECREMENT
});

const initialState = {
  count: 0,
  name: "Aliaksei"
};

const reducer = (state = initialState, { type }) => {
  switch (type) {
    case INCREMENT:
      return {
        ...state,
        count: state.count + 1
      };
    case DECREMENT:
      return {
        ...state,
        count: state.count - 1
      };
    default:
      return state;
  }
};

export const store = createStore(reducer);

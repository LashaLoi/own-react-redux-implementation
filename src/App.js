import React from "react";
import logo from "./logo.svg";

import { useSelector, useDispatch } from "./react-redux";
import { increment, decrement } from "./store";

const App = () => {
  const count = useSelector(({ count }) => count);
  const dispatch = useDispatch();

  const handleIncrement = () => dispatch(increment());
  const handleDecrement = () => dispatch(decrement());

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="container">
          <button onClick={handleDecrement}>{"<"}</button>
          <div>{count}</div>
          <button onClick={handleIncrement}>{">"}</button>
        </div>
      </header>
    </div>
  );
};

export default App;

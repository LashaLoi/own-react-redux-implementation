import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { connect } from "./react-redux";
import { increment, decrement } from "./store";

const App = ({ increment, decrement, count }) => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="container">
          <button onClick={decrement}>{"<"}</button>
          <div>{count}</div>
          <button onClick={increment}>{">"}</button>
        </div>
      </header>
    </div>
  );
};

const mapStateToProps = ({ count }) => ({ count });
const mapDispatchToProps = dispatch => ({
  increment: () => dispatch(increment()),
  decrement: () => dispatch(decrement())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

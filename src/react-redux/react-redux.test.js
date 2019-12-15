import React from "react";
import { Provider, connect } from ".";
import { store } from "../store";
import App from "../App";
import { render, fireEvent, cleanup } from "@testing-library/react";

const renderWithReduxProvider = Component =>
  render(
    <Provider store={store}>
      <Component />
    </Provider>
  );

// beforeEach(cleanup);
afterEach(cleanup);

describe("test react-redux", () => {
  describe("Provider", () => {
    it("test Provider with store", () => {
      renderWithReduxProvider(App);
    });
  });

  describe("connect", () => {
    it("test connect without params", () => {
      const component = () => <div className="">Hello</div>;
      const componentWithConnect = connect()(component);

      renderWithReduxProvider(componentWithConnect);
    });

    it("test connect with mapStateToProps with count", () => {
      const component = ({ count }) => <div>{count}</div>;
      const mapStateToProps = ({ count }) => ({ count });
      const componentWithConnect = connect(mapStateToProps)(component);

      const { getByText } = renderWithReduxProvider(componentWithConnect);

      const text = "0";

      const elementFromState = getByText(text);

      expect(elementFromState.textContent).toEqual(text);
    });

    it("test connect with mapStateToProps with name", () => {
      const component = ({ name }) => <div>{name}</div>;
      const mapStateToProps = ({ name }) => ({ name });
      const componentWithConnect = connect(mapStateToProps)(component);

      const { getByText } = renderWithReduxProvider(componentWithConnect);

      const text = "Aliaksei";

      const elementFromState = getByText(text);

      expect(elementFromState.textContent).toEqual(text);
    });

    it("test connect with all state", () => {
      const component = ({ name, count }) => (
        <>
          <div>{count}</div>
          <div>{name}</div>
        </>
      );
      const mapStateToProps = state => state;
      const componentWithConnect = connect(mapStateToProps)(component);

      const { getByText } = renderWithReduxProvider(componentWithConnect);

      const firstText = "Aliaksei";
      const secondText = "0";

      const divWithZero = getByText(secondText);
      const divWithName = getByText(firstText);

      expect(divWithName.textContent).toEqual(firstText);
      expect(divWithZero.textContent).toEqual(secondText);
    });

    it("test connect with mapDispatchToProps", () => {
      const callback = jest.fn();
      const component = ({ increment }) => <div onClick={increment}>Click</div>;

      const mapDispatchToProps = () => ({
        increment: callback
      });

      const componentWithConnect = connect(null, mapDispatchToProps)(component);

      const { getByText } = renderWithReduxProvider(componentWithConnect);

      fireEvent.click(getByText("Click"));

      expect(callback.mock.calls.length).toEqual(1);
    });

    it("test connect with mapDispatchToProps with diff func", () => {
      const firstCallback = jest.fn();
      const secondCallback = jest.fn();
      const component = ({ increment, decrement }) => (
        <>
          <button onClick={increment}>+</button>
          <button onClick={decrement}>-</button>
        </>
      );

      const mapDispatchToProps = () => ({
        increment: firstCallback,
        decrement: secondCallback
      });

      const componentWithConnect = connect(null, mapDispatchToProps)(component);

      const { getByText } = renderWithReduxProvider(componentWithConnect);

      fireEvent.click(getByText("+"));
      fireEvent.click(getByText("+"));
      fireEvent.click(getByText("-"));

      expect(firstCallback.mock.calls.length).toEqual(2);
      expect(secondCallback.mock.calls.length).toEqual(1);
    });

    it("test connect with mapDispatchToProps and mapStateToProps", () => {
      const component = ({ increment, count }) => (
        <>
          <button onClick={increment}>+</button>
          <div>{count}</div>
        </>
      );
      const mapStateToProps = ({ count }) => ({ count });

      const mapDispatchToProps = dispatch => ({
        increment: () => dispatch({ type: "INCREMENT" })
      });

      const componentWithConnect = connect(
        mapStateToProps,
        mapDispatchToProps
      )(component);

      const { getByText } = renderWithReduxProvider(componentWithConnect);

      expect(getByText("0").textContent).toEqual("0");

      fireEvent.click(getByText("+"));

      expect(getByText("1").textContent).toEqual("1");
    });

    it("test connect with complex mapDispatchToProps and mapStateToProps", () => {
      const firstCallback = jest.fn();
      const secondCallback = jest.fn();

      const component = ({ increment, decrement, count }) => (
        <>
          <button onClick={increment}>+</button>
          <div>{count}</div>
          <button onClick={decrement}>-</button>
        </>
      );
      const mapStateToProps = ({ count }) => ({ count });

      const mapDispatchToProps = dispatch => ({
        increment: () => {
          firstCallback();
          dispatch({ type: "INCREMENT" });
        },
        decrement: () => {
          secondCallback();
          dispatch({ type: "DECREMENT" });
        }
      });

      const componentWithConnect = connect(
        mapStateToProps,
        mapDispatchToProps
      )(component);

      renderWithReduxProvider(componentWithConnect);
    });
  });
});

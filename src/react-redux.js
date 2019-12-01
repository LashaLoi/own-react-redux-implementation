import React, { createContext, useContext, useState, useEffect } from "react";

const Store = createContext();

const isFn = fn => typeof fn === "function";

const handleMergedProps = (...args) =>
  args.reduce((acc, curr) => ({ ...acc, ...curr }), {});

export const Provider = ({ store, children }) => {
  if (!store) throw new Error("Store is not exits");

  return <Store.Provider value={store}>{children}</Store.Provider>;
};

export const connect = (
  mapStateToProps,
  mapDispatchToProps,
  mergedProps
) => WrappedComponent => ownProps => {
  const { getState, subscribe, dispatch } = useContext(Store);
  const [store, setStore] = useState(getState);

  const handleStoreChange = () => setStore(getState);

  useEffect(() => {
    const unsubscribe = subscribe(handleStoreChange);

    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  const state = isFn(mapStateToProps) && mapStateToProps(store, ownProps);

  const actions =
    isFn(mapDispatchToProps) && mapDispatchToProps(dispatch, ownProps);

  const props = isFn(mergedProps)
    ? mergedProps(state, actions, ownProps)
    : handleMergedProps(state, actions, ownProps);

  return <WrappedComponent {...props} />;
};

export const connectAsClass = (
  mapStateToProps,
  mapDispatchToProps,
  mergedProps
) => WrappedComponent =>
  class extends React.Component {
    static contextType = Store;

    state = this.context.getState();
    unsubscribe;

    handleStoreChange = () => this.setState(this.context.getState());

    componentDidMount() {
      this.unsubscribe = this.context.subscribe(this.handleStoreChange);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      const state =
        isFn(mapStateToProps) && mapStateToProps(this.state, this.props);

      const actions =
        isFn(mapDispatchToProps) &&
        mapDispatchToProps(this.context.dispatch, this.props);

      const props = isFn(mergedProps)
        ? mergedProps(state, actions, this.props)
        : handleMergedProps(state, actions, this.props);

      return <WrappedComponent {...props} />;
    }
  };

export const useSelector = mapStateToProps => {
  const { getState, subscribe } = useContext(Store);
  const [store, setStore] = useState(getState);

  const handleStoreChange = () => setStore(getState);

  useEffect(() => {
    const unsubscribe = subscribe(handleStoreChange);

    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  const state = isFn(mapStateToProps) && mapStateToProps(store);

  return state;
};

export const useDispatch = () => {
  const { dispatch } = useContext(Store);

  return dispatch;
};

export const useStore = () => {
  const store = useContext(Store);

  return store;
};

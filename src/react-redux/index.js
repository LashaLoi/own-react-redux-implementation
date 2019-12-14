import React, { createContext, useContext, useState, useEffect } from "react";

const Store = createContext();

const isFn = fn => typeof fn === "function";

const handleMergedProps = (...args) =>
  args.reduce((acc, curr) => ({ ...acc, ...curr }), {});

export const Provider = ({ store, children }) => {
  if (!store) throw new Error("Store is not exits");

  return <Store.Provider value={store}>{children}</Store.Provider>;
};

export const connect = (mstp, mdtp, mp) => WrappedComponent => ownProps => {
  const { getState, subscribe, dispatch } = useContext(Store);
  const [store, setStore] = useState(getState);

  const handleStoreChange = () => setStore(getState);

  useEffect(() => {
    const unsubscribe = subscribe(handleStoreChange);

    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  const state = isFn(mstp) && mstp(store, ownProps);

  const actions = isFn(mdtp) && mdtp(dispatch, ownProps);

  const props = isFn(mp)
    ? mp(state, actions, ownProps)
    : handleMergedProps(state, actions, ownProps);

  return <WrappedComponent {...props} />;
};

export const connectAsClass = (mstp, mdtp, mp) => WrappedComponent =>
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
      const state = isFn(mstp) && mstp(this.state, this.props);

      const actions = isFn(mdtp) && mdtp(this.context.dispatch, this.props);

      const props = isFn(mp)
        ? mp(state, actions, this.props)
        : handleMergedProps(state, actions, this.props);

      return <WrappedComponent {...props} />;
    }
  };

export const useSelector = mstp => {
  const { getState, subscribe } = useContext(Store);
  const [store, setStore] = useState(getState);

  const handleStoreChange = () => setStore(getState);

  useEffect(() => {
    const unsubscribe = subscribe(handleStoreChange);

    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  const state = isFn(mstp) && mstp(store);

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

import React, { createContext, useContext, useState, useEffect } from "react";

const ReactReduxContext = createContext();

export const Provider = ({ children, store }) => {
  if (!store) throw new Error("Store is not exits");

  return (
    <ReactReduxContext.Provider value={store}>
      {children}
    </ReactReduxContext.Provider>
  );
};

const isFn = fn => typeof fn === "function";

const handleMergedProps = (...args) =>
  args.reduce((acc, curr) => ({ ...acc, ...curr }), {});

export const connect = (mstp, mdtp, mp) => WrappedComponent => ownProps => {
  const { getState, dispatch, subscribe } = useContext(ReactReduxContext);
  const [storeState, setStoreState] = useState(getState);

  const handleStore = () => setStoreState(getState);

  useEffect(() => {
    const unsubscribe = subscribe(handleStore);

    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  const state = isFn(mstp) && mstp(storeState);
  const actions = isFn(mdtp) && mdtp(dispatch);
  const props = isFn(mp)
    ? mp(state, actions, ownProps)
    : handleMergedProps(state, actions, ownProps);

  return <WrappedComponent {...props} />;
};

export const connectAsClass = (mstp, mdtp, mp) => WrappedComponent =>
  class extends React.PureComponent {
    static contextType = ReactReduxContext;

    state = this.context.getState();
    unsubscribe;

    handleStore = () => this.setState(this.context.getState());

    componentDidMount() {
      this.unsubscribe = this.context.subscribe(this.handleStore);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      const state = isFn(mstp) && mstp(this.state);
      const actions = isFn(mdtp) && mdtp(this.context.dispatch);
      const props = isFn(mp)
        ? mp(state, actions, this.props)
        : handleMergedProps(state, actions, this.props);

      return <WrappedComponent {...props} />;
    }
  };

export const useSelector = mstp => {
  const { getState, subscribe } = useContext(ReactReduxContext);
  const [storeState, setStoreState] = useState(getState);

  const handleStore = () => setStoreState(getState);

  useEffect(() => {
    const unsubscribe = subscribe(handleStore);

    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  const state = isFn(mstp) && mstp(storeState);

  return state;
};

export const useDispatch = () => {
  const { dispatch } = useContext(ReactReduxContext);

  return dispatch;
};

export const useStore = () => useContext(ReactReduxContext);

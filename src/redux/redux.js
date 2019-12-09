class EventEmitter {
  constructor() {
    this.events = {};
  }

  subscribe(eventName, fn) {
    if (!this.events[eventName]) this.events[eventName] = [];

    this.events[eventName].push(fn);

    return () => {
      this.events[eventName] = this.events[eventName].filter(
        eventFn => fn !== eventFn
      );
    };
  }

  emit(eventName, data) {
    const event = this.events[eventName];

    if (event) {
      event.forEach(fn => {
        fn.call(null, data);
      });
    }
  }
}

export const createStore = (reducer, defaultState) => {
  let state = reducer(defaultState, {});
  let emitter = new EventEmitter();

  emitter.subscribe("change:state", dispatch => {
    state = reducer(state, dispatch);
  });

  return {
    getState: () => state,
    dispatch: dispatch => emitter.emit("change:state", dispatch),
    subscribe: cb => emitter.subscribe("change:state", cb)
  };
};

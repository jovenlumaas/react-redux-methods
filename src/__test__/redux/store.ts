import { createStore, compose, Store } from 'redux';
import { rootReducer, initialState } from './reducers';

// import { saveToSessionStorage, loadFromSessionStorage } from '../helpers/storageSession';

type TInitKeys = keyof typeof initialState;
// const persistKeys: TInitKeys[] = ['views'];

const loadInitialState = () => {
  return Object.keys(initialState).reduce((acc, key) => {
    // if (persistKeys.includes(key as TInitKeys)) return { ...acc, [key]: loadFromSessionStorage(key) };
    return { ...acc, [key]: initialState[key as TInitKeys] };
  }, {});
};

const savePersistedState = (store: Store) => {
  // const state = store.getState();
  // persistKeys.forEach((key) => {
  //   saveToSessionStorage(state[key] as any, key);
  // });
};

const loadStore = () => {
  try {
    //persist store data from session storage
    const persistedState = typeof window !== 'undefined' && window.sessionStorage ? loadInitialState() : initialState;

    // const composeEnhancers =
    //   typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    //     ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    //     : compose;

    //create store
    const store = createStore(
      rootReducer,
      persistedState,
      compose(), // composeEnhancers()
    );

    //run store subscriptions
    store.subscribe(() => savePersistedState(store));

    return store;
  } catch (err: any) {
    console.error('Redux Store Error: ', err.message);
    throw new Error(err.message);
  }
};

const store = loadStore();
export default store;

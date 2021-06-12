# React-Redux Methods

A lightweight and performant react-redux utilities that would help reduce the
size of your codebase for creating redux boilerplate. As a result, your
codebase would be easy to maintain as it fully utilizes typescript intellisense
-- from creating redux contexts (reducers, actions, selectors) to your react
component (consuming state, dispatching action). Typescript users would have a
full advantage as it is built with typescript.

## Installation

    npm install react-redux-methods

## How to use?

### `Creating Redux Contexts (reducer, actions, selectors)`

```ts
import { createReduxMethods, ComposePayload } from 'react-redux-methods';

interface INotification {
  isOpen: boolean;
  message: string;
}

const initialState: INotification = {
  isOpen: false,
  message: '',
};

const [notificationsReducer, notificationsActions, notificationsSelectors] = createReduxMethods({
  initialState,
  reducers: {
    setNotificationShow: (state, action) => ({
      ...state,
      isOpen: true,
      message: action.payload,
    }),
    setNotificationHide: () => initialState,
    // You can define your own type for payload using 'ComposePayload' generics. In this case, we use 'string' type
    // for a 'message' property. This provides typescript intellisense for your payload when dispatching an action.
    updateNotification: (s, a: ComposePayload<string>) => ({
      ...s,
      message: a.payload,
    }),
  },
  selectionNode: 'globals.notifications', // <--- in this case, 'notifications' is located in 'globals' node of the
  // redux state tree. 'selectionNode' parameter should always be defined when 'selectors' parameter is defined.
  selectors: {
    getNotification: (s) => s,
    getNotificationMessage: (s) => s.message, // < -- under the hood, the actual output of your selector is
    // '(state) => state.globals.notifications.message' but you only provide a shorthand version with typescript
    // intellisense.

    // Please take note that you can apply 'reselect' api here since it is one of the dependencies of this package
    // (see 'reselect' documentation).
  },
});

// export all
export { notificationsReducer, notificationsActions, notificationsSelectors };
```

You would then combine your reducers, actions, and selectors.

```ts
import { combineReducers } from 'redux';

import { notificationsReducer, notificationsActions, notificationsSelectors } from './notifications';

// combine reducers
const globalReducer = combineReducers({
  notifications: notificationsReducer,
  // ...other reducers
});

// combine actions
const actions = {
  ...notificationsActions,
  // ...other actions
};

// combine actions
const selectors = {
  ...notificationsSelectors,
  // ...other selectors
};
```

### `Consuming redux contexts (for your react component)`

Instead of using these common 'connect' or 'useSelector'/'useDispatch' methods
from 'redux'/'react-redux', you can connect redux to your component using our
helper functions. So that it would utilize typescript intellisense and all of
your 'actions' and 'selectors' would easily be accessed by your component.

You must first define your redux connector ONCE only. Then you can consume it by
all of your react components that utilize redux state.

In this case we will place our connector functions in the 'connections.ts' file.

```ts
import { createConnector, createDispatch, createGroupDispatch, createStateSelector } from 'react-redux-methods';

import store from './store';
import selectors from './selectors';
import actions from './actions';

export const reduxConnector = createConnector(selectors, actions);
export const dispatchAction = createDispatch(store.dispatch, actions);
export const makeGroupDispatch = createGroupDispatch(actions);
export const getValue = createStateSelector(store.getState(), selectors);
```

You would then consume the created connections to your component.

```ts
import type { ConnectedProps } from 'react-redux';
import { reduxConnector } from './connections';

// 'reduxConnector' function provides typescript intellisense for react-redux's 'connect' api.
// This means that all of your pre-defined 'selectors' and 'actions' will be provided by typescript
// to your component.
const connector = reduxConnector(
  (selectors) => ({ notification: selectors.getNotification }),
  (actions) => ({ setNotificationShow: actions.setNotificationShow }),
);

type Props = ConnectedProps<typeof connector>;

const App = ({
  notification, // <-- type inference is 'INotification' as defined above.
  setNotificationShow, // <-- type inference is '(payload: string) => INotification'
}: Props) => {
  return (
    <div>
      <p>`Notification: ${notification.message}`</p>
      <button onClick={() => setNotificationShow('Hello World!')}>Show Notification</button>;
    </div>
  );
};
```

You can also dispatch an action or get a state outside of your react component.

```ts
import { dispatchAction, getValue } from './connections';

const toastNotificationShow = (message) => {
  // ....your code logic

  // all of the parameters are also powered by typescript
  // the first parameter is the 'action' to dispatch and the other is the 'payload'
  dispatchAction('setNotificationShow', message);
};

const getNotification = () => {
  // ...your code logic

  // the parameter is the 'selector' name which is also powered by typescript.
  return getValue('getNotification');
};
```

# React-Redux Methods

A lightweight and performant react-redux utilities that would help reduce the
size of your codebase for creating redux boilerplates. As a result, your
codebase would be easy to maintain as it fully utilizes typescript intellisense
-- from creating redux context (reducers, actions, selectors) to your react
component (consuming state, dispatching action). Typescript users would have a
full advantage as it is built with typescript.

## How to use?

### `Creating Redux Context (reducer, actions, selectors)`

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
    // You can define your own type for payload using 'ComposePayload' generics. In this case, we use 'string' type for a 'message' property.
    updateNotification: (s, a: ComposePayload<string>) => ({
      ...s,
      message: a.payload,
    }),
  },
  selectionNode: 'globals.notifications', // <--- in this case, 'notifications' is located in 'globals' node of the of the redux state. 'selectionNode' should always be defined when 'selectors' is defined.
  selectors: {
    getNotification: (s) => s,
  },
});

//export all
export { notificationsReducer, notificationsActions, notificationsSelectors };
```

You would then combine your reducers, actions, and selectors.

```ts
import { combineReducers } from "redux";

import {
  notificationsReducer,
  notificationsActions,
  notificationsSelectors,
} from "./notifications";

// combine reducers
const globalReducer = combineReducers({
    notifications: notificationsReducer,
    ... // other reducers
})

// combine actions
const actions = {
    ...notificationsActions,
    ... // other actions
}

// combine actions
const selectors = {
    ...notificationsSelectors,
    ... // other selectors
}
```

### `Connecting redux to your react component`

Instead of using these common 'connect' or 'useSelector'/'useDispatch' methods
from 'redux'/'react-redux', you can connect redux to your component using our
helper functions. So that it would utilize typescript intellisense and all of
your 'actions' and 'selectors' would easily be accessed.

You must first define your redux connector ONCE only. You can then consume it by
all of your react components that utilizes redux state.

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

const connector = reduxConnector(
  (selectors) => ({ notifications: selectors.getNotification }),
  (actions) => ({ setNotificationShow: actions.setNotificationShow }),
);

type Props = ConnectedProps<typeof connector>;

const App = ({
  notifications, // <-- type inference is 'INotification' as defined above.
  setNotificationShow, // <-- type inference is '(payload: string) => INotification'
}: Props) => {
  return <button onClick={() => setNotificationShow('Hello World!')}>Show Notification</button>;
};
```

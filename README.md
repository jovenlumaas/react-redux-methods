# React-Redux Methods

A **lightweight, strongly-typed toolkit** for building React-Redux applications with **minimal boilerplate**.  
This library helps you define reducers, actions, and selectors with complete TypeScript intellisense — while keeping your Redux setup elegant and maintainable.

---

## ✨ Features

- ⚡ **Zero Redux boilerplate** — no need to write separate action types or creators.
- 🧠 **Full TypeScript support** — complete intellisense for state, actions, and selectors.
- 🔄 **Composable utilities** — connect, dispatch, and select anywhere (inside or outside React).
- 🧩 **Reselect integration** — supports memoized selectors out of the box.
- 🪶 **Tiny footprint** — built with simplicity and performance in mind.
- 🧱 **Predictable structure** — reducers, actions, and selectors auto-generated and easy to maintain.

---

## 📦 Installation

    npm install react-redux-methods

🚀 Getting Started

1️⃣ Create Redux Contexts (reducer, actions, selectors)

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

    // You can define your own payload type using the `ComposePayload` generic.
    // This provides full TypeScript inference when dispatching actions.
    updateNotification: (state, action: ComposePayload<string>) => ({
      ...state,
      message: action.payload,
    }),
  },
  selectionNode: 'globals.notifications', // Path of this state in your Redux store
  selectors: {
    getNotification: (s) => s,
    getNotificationMessage: (s) => s.message,

    // You can also use `reselect` APIs here (already included as a dependency)
  },
});

export { notificationsReducer, notificationsActions, notificationsSelectors };
```

2️⃣ Combine Reducers, Actions, and Selectors

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

3️⃣ Create Reusable Redux Connections

Create a single file (e.g. connections.ts) to define your Redux utilities and connectors.

```ts
import { createConnector, createDispatch, createGroupDispatch, createStateSelector } from 'react-redux-methods';

import { store } from './store';
import selectors from './selectors';
import actions from './actions';

// Create helpers
export const reduxConnector = createConnector(selectors, actions);
export const dispatchAction = createDispatch(store.dispatch, actions);
export const makeGroupDispatch = createGroupDispatch(actions);

// ✅ Always gets the latest Redux state
export const getValue = createStateSelector(store, selectors);
```

4️⃣ Connect Redux to Your React Component

Use the reduxConnector helper to automatically inject typed state and actions.

```ts
import type { ConnectedProps } from 'react-redux';
import { reduxConnector } from './connections';

const connector = reduxConnector(
  (selectors) => ({ notification: selectors.getNotification }),
  (actions) => ({ setNotificationShow: actions.setNotificationShow }),
);

type Props = ConnectedProps<typeof connector>;

const App = ({
  notification, // ✅ type: INotification
  setNotificationShow, // ✅ type: (payload: string) => INotification
}: Props) => {
  return (
    <div>
      <p>Notification: {notification.message}</p>
      <button onClick={() => setNotificationShow('Hello World!')}>Show Notification</button>
    </div>
  );
};

export default connector(App);
```

5️⃣ Dispatch Actions or Get State Outside React Components

You can also safely access and modify Redux state anywhere in your app.

```ts
import { dispatchAction, getValue } from './connections';

export const toastNotificationShow = (message: string) => {
  // Example custom logic...

  // Dispatch Redux action with TypeScript support
  dispatchAction('setNotificationShow', message);
};

export const getNotification = () => {
  // Access Redux state directly, always up-to-date
  return getValue('getNotification');
};
```

🧩 API Overview

| Function                  | Description                                                      |
| ------------------------- | ---------------------------------------------------------------- |
| **`createReduxMethods`**  | Generates reducers, actions, and selectors from a single config. |
| **`createConnector`**     | Simplifies React-Redux `connect` usage with full typing.         |
| **`createDispatch`**      | Creates a typed dispatch function for actions.                   |
| **`createGroupDispatch`** | Combines related dispatchers for cleaner grouping.               |
| **`createStateSelector`** | Returns the latest Redux state value anywhere in your app.       |

🧠 TypeScript Advantages

1. Intellisense everywhere — state, action names, and payloads are inferred.
2. Compile-time safety — no more mismatched action types or payloads.
3. Minimal imports — keep Redux logic compact and consistent.

🔄 Data Flow Overview

Below is the simplified Redux data flow as implemented by react-redux-methods:

```scss
        ┌───────────────────────────────┐
        │         Component UI          │
        │ (calls typed action or select)│
        └──────────────┬────────────────┘
                       │
                       ▼
           ┌────────────────────┐
           │   Actions (typed)  │
           │   e.g. setUser()   │
           └────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │    Reducers        │
           │   (update state)   │
           └────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │     Store (Redux)  │
           └────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │   Selectors (typed)│
           │ e.g. getUserName() │
           └────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │   Component UI     │
           │  (re-renders)      │
           └────────────────────┘
```

✅ Simplified syntax
✅ Typed end-to-end
✅ Reusable outside React

🔁 Migration from Vanilla Redux

If you’re coming from standard Redux setup, here’s a comparison.

🧱 Classic Redux (verbose)

```ts
// action types
const SET_NOTIFICATION = 'SET_NOTIFICATION';

// actions
export const setNotification = (message: string) => ({
  type: SET_NOTIFICATION,
  payload: message,
});

// reducer
const initialState = { isOpen: false, message: '' };

export function notificationReducer(state = initialState, action: any) {
  switch (action.type) {
    case SET_NOTIFICATION:
      return { ...state, isOpen: true, message: action.payload };
    default:
      return state;
  }
}

// selector
export const getNotificationMessage = (state: any) => state.notification.message;
```

⚡ Using react-redux-methods

```ts
import { createReduxMethods, ComposePayload } from 'react-redux-methods';

const [notificationReducer, notificationActions, notificationSelectors] = createReduxMethods({
  initialState: { isOpen: false, message: '' },
  reducers: {
    setNotification: (s, a: ComposePayload<string>) => ({
      ...s,
      isOpen: true,
      message: a.payload,
    }),
  },
  selectionNode: 'notification',
  selectors: {
    getNotificationMessage: (s) => s.message,
  },
});

// use anywhere:
dispatchAction('setNotification', 'Hello!');
getValue('getNotificationMessage');
```

✅ No manual action types
✅ No switch statements
✅ Strong typing by default

⚖️ License
MIT © 2025

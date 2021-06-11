import { createSelector } from 'reselect';
import get = require('lodash.get');

import type { AnyAction } from 'redux';
import type {
  ParamsShape,
  ResponseShape,
  ComposePayload as CreatePayload,
  FormatEachReducer,
  SelectorShape,
} from '../types';

type TCreateReduxMethods = <
  S,
  R extends FormatEachReducer<S>,
  GS extends SelectorShape<S>,
  SPath extends string = string,
>(
  options: ParamsShape<S, R, GS, SPath>,
) => ResponseShape<S, R, GS>;

/**
 * A function that returns a tuple ['reducer','actions', 'stateSelections'] based on the provided required parameters including
 * 'initialState', and state mutation 'reducers'.
 *
 * @param initialState Accepts any kind of value, such as object, number, string, null, except undefined.
 *
 * @param reducers Accepts an object of functions (or reducer) used in mutating state. Each function has two arguments -- 'State' or previous
 *    state, and optional 'Payload'. For example, (state) => state or (state, action) => state. When providing second argument 'payload'
 *    'ComposePayload' type must be used as utility type. For example, (state: State, action: ComposePayload\<string\>) => ({...state, firstName: action.payload}).
 *
 * @param selectionNode A string that must be provided when making state selections partnered with 'selectors' parameter. The format of
 *    this string should be in dot notation as how the case state node is located in the redux state. For example, root
 *    state 'communications.chats'.
 *
 * @param selectors An object of selection functions that uses 'createSelector' function of 'reselect' package under the hood.
 *    Partnered with 'selectionNode' parameter, each case selection can accept multiple arguments but the first argument is restricted
 *    for the result of 'selectionNode' which represents the current state of the node. For example, (state, prop) => state.currentUser.id = prop.
 *    In most cases, the single argument pattern, for example (state) => state.currentUser, is the common selection pattern.
 *
 *    Under the hood, each selection is converted to a standard redux selection pattern that starts from the root node of the redux state.
 *    In this case, the actual selection is (reduxState) => reduxState.communications.chats.currentUser.
 *
 * @returns A tuple as ['reducer','actions', 'stateSelections']. In a 'reducer', it is a function that invokes every reducer inside the passed
 *   object, and builds a state object with the same shape, while in 'actions' are the transformed reducers that optionally
 *   accepts a 'payload' based on the second parameter of each case reducer. If action is provided, then the consumer react
 *   component should provide a single argument "payload". The 'stateSelections' are the transformed case selections conformed with
 *   redux selection pattern such as (reduxState) => reduxState.communications.chats.currentUser.
 */
export const createReduxMethods: TCreateReduxMethods = ({ initialState, reducers, selectionNode, selectors }) => {
  // compose a reducer function
  const reducer = (state: any = initialState, action: AnyAction) => {
    if (reducers.hasOwnProperty(action.type)) {
      return reducers[action.type](state, action as any);
    } else {
      return state as any;
    }
  };

  // compose actions for react components to dispatch
  const actions = Object.keys(reducers).reduce((acc, key) => {
    const reducerMeta = reducers[key as keyof typeof reducers];

    if (reducerMeta.length === 2) {
      return {
        ...acc,
        [key]: (payload: CreatePayload<any>) => ({ type: key, payload }),
      };
    } else {
      return {
        ...acc,
        [key]: () => ({ type: key }),
      };
    }
  }, {} as any);

  // compose selectors
  let selections: any = {};
  if (selectionNode && selectors) {
    selections = Object.keys(selectors).reduce(
      (acc, key) => ({
        ...acc,
        [key]: createSelector(
          (state: any, ...ownProps: any) => ({
            nodeState: get(state, selectionNode),
            ownProps,
          }), // get starting point state (node state)
          ({ nodeState, ownProps }) => selectors[key](nodeState, ...ownProps), // pass the result of '(state: ReduxState) => get(state, selectionNode)' as
          // argument of each selector
        ),
      }),
      {},
    );
  }

  return [reducer, actions, selections];
};

// *************************** EXAMPLE USE CASE  *********************************
// type StateShape = {
//   isOk: boolean;
//   canFly: boolean;
// };

// const initialState: StateShape = {
//   isOk: true,
//   canFly: false,
// };

// const [reducer, actions] = createReduxMethods({
//   initialState,
//   reducers: {
//     makeFly: (s, a: CreatePayload<{ canFly: boolean }>) => ({
//       ...s,
//       ...a.payload,
//     }),
//     canMake: (s) => ({ ...s }),
//   },
// });

// const data = actions.makeFly({ canFly: true });
// const data1 = actions.canMake();

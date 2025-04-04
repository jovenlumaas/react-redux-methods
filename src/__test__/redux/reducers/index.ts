import { combineReducers } from 'redux';

import { viewsReducer, viewsActions, viewsSelectors, viewsInitialState } from './views';

import { notifiersReducer, notifiersActions, notifiersSelectors, notifiersInitialState } from './notifiers';

// combine reducers
export const rootReducer = combineReducers({
  views: viewsReducer,
  notifiers: notifiersReducer,
});

// combine actions
export const actions = {
  ...viewsActions,
  ...notifiersActions,
};

// combine actions
export const selectors = {
  ...viewsSelectors,
  ...notifiersSelectors,
};

// combine initialState (NOTE: MUST BE EXACT NAME OF CORRESPONDING REDUCER)
export const initialState = {
  views: viewsInitialState,
  notifiers: notifiersInitialState,
};

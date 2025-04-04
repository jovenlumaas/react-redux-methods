import { createConnector, createDispatch, createStateSelector } from '../../core';
import { actions, selectors } from './reducers';
import store from './store';

export const reduxConnector = createConnector(selectors, actions);
export const dispatch = createDispatch(store.dispatch, actions);
export const getState = createStateSelector(store.getState(), selectors);

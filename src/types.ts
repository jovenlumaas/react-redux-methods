import type { Action, AnyAction, Reducer } from 'redux';

// ******************************** UTILITY TYPES ************************************

type MapValue<T> = {
  [P in keyof T]: T[P];
};

type ActionPayload<P = void, T extends string = string> = {
  payload: P;
  type: T;
};

type EachReducer<S, A extends Action = AnyAction> = (state: S, action: A) => S;

// ******************************** PARAMS SHAPE ************************************

type MapReducers<State, Reducers> = {
  [K in keyof Reducers]: Reducers[K] extends (...args: infer SA) => any ? (...args: SA) => State : Reducers[K];
};

// ******************************** RESPONSE SHAPE ************************************

type ReturnPayload<A> = A extends { payload: infer O } ? O : never;

type ComposeAction<A> = A extends ComposePayload<any>
  ? (payload: ReturnPayload<A>) => void // or State
  : () => void; // or State;

export type MapComposeAction<S, R> = {
  [P in keyof R]: R[P] extends (state: any, action: infer A) => S ? ComposeAction<A> : () => void; // or S;
};

// ******************************** EXPORTS ************************************

type ParamsWithoutSelectors<State, Reducers> = {
  initialState: State;
  reducers: MapReducers<State, Reducers>;
  selectionNode?: never;
  selectors?: never;
};

type ParamsWithSelectors<State, Reducers, Selectors, SPath> = {
  initialState: State;
  reducers: MapReducers<State, Reducers>;
  selectionNode: SPath;
  selectors: Selectors;
};

export type ParamsShape<State, Reducers, Selectors, SPath> =
  | ParamsWithoutSelectors<State, Reducers>
  | ParamsWithSelectors<State, Reducers, Selectors, SPath>;

export type ResponseShape<State, Reducers, Selectors> = [
  Reducer<State, AnyAction>,
  MapComposeAction<State, Reducers>,
  MapValue<Selectors>,
];

export type ComposePayload<P = void> = {
  payload: P;
};

export type FormatEachReducer<State> = {
  [K: string]: EachReducer<State, ActionPayload<any>>;
};

export type SelectorShape<State> = {
  [key: string]: (state: State, ...args: any) => State | State[keyof State] | any;
};

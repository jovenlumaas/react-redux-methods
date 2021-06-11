import type { Dispatch, AnyAction } from 'redux';

type InferActionPayloadParam<A, T extends keyof A> = A[T] extends (payload: infer P) => any
  ? P extends undefined
    ? void
    : P
  : void;

type TCreateDispatchFn<A> = <T extends keyof A>(type: T, payload: InferActionPayloadParam<A, T>) => void;

export const createDispatch = <D extends Dispatch<AnyAction>, A>(
  dispatch: D,
  action: A, // <--- 'action' is for typescript intellicense only
): TCreateDispatchFn<A> => {
  return (type, payload) => {
    if (payload === undefined) {
      dispatch({ type });
    } else {
      dispatch({ type, payload });
    }
  };
};

type MapDispatchGroupParam<T> = {
  [key: string]: keyof T;
};

type MapDispatchGroupResponse<T, A extends MapDispatchGroupParam<T>> = {
  [P in keyof A]: T[A[P]];
};

type TCreateGroupDispatchFn<A> = <K extends keyof A, AT extends Record<string, K>>(
  actionTypes: AT,
) => MapDispatchGroupResponse<A, AT>;

export const createGroupDispatch = <A>(actions: A): TCreateGroupDispatchFn<A> => {
  return (actionTypes) =>
    Object.keys(actionTypes).reduce((acc, key) => {
      const actionName = actionTypes[key];
      return { ...acc, [key]: actions[actionName] };
    }, {}) as any;
};

// REFERENCE: https://stackoverflow.com/questions/55173436/typescript-how-to-make-an-optional-second-argument-required-based-on-the-value

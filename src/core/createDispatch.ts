import type { Dispatch, AnyAction } from 'redux';

type TCreateDispatchFn<A extends Record<string, (...args: any[]) => any>> = <T extends keyof A>(
  type: T,
  ...args: Parameters<A[T]>
) => void;

export const createDispatch = <D extends Dispatch<AnyAction>, A extends Record<string, (...args: any[]) => any>>(
  dispatch: D,
  action: A, // <--- 'action' is for typescript intellicense only
): TCreateDispatchFn<A> => {
  return (type, ...args) => {
    if (args.length === 1) {
      dispatch({ type, payload: args[0] } as any);
    } else {
      dispatch({ type } as any);
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

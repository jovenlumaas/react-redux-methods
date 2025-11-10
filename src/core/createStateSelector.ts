import { Store } from 'redux';

type GetValueResponse<T> = T extends (...args: any[]) => infer R ? R : never;

type TCreateStateSelectorFn = <S, SL extends Record<string, (...args: any[]) => any>>(
  store: Store<S>,
  selectors: SL,
) => <K extends keyof SL>(selector: K) => GetValueResponse<SL[K]>;

export const createStateSelector: TCreateStateSelectorFn = (store, selectors) => (selector) => {
  const state = store.getState();
  return selectors[selector](state, undefined);
};

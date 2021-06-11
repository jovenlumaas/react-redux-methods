type GetValueResponse<T> = T extends (...args: any[]) => infer R ? R : never;

type TCreateStateSelectorFn = <S, SL extends Record<string, (...args: any[]) => any>>(
  state: S,
  selectors: SL,
) => <K extends keyof SL>(selector: K) => GetValueResponse<SL[K]>;

export const createStateSelector: TCreateStateSelectorFn = (state, selectors) => (selector) =>
  selectors[selector](state, undefined);

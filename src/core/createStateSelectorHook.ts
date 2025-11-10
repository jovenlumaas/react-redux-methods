import { useSelector } from 'react-redux';

/**
 * Utility to create a strongly typed hook for accessing Redux state via selectors.
 *
 * @template SL - The type of your selectors object.
 * @param selectors - A map of selector functions (e.g., { getUser, getCompany }).
 * @returns A hook function that infers the selector's return type automatically.
 *
 * @example
 * ```ts
 * // selectors.ts
 * export const selectors = {
 *   getUser: (state: RootState) => state.user,
 *   getCompany: (state: RootState) => state.company,
 * };
 *
 * // useGetState.ts
 * export const useGetState = createStateSelectorHook(selectors);
 *
 * // usage inside component
 * const user = useGetState("getUser"); // user is typed as User
 * const company = useGetState("getCompany"); // company is typed as Company
 * ```
 */
export const createStateSelectorHook = <SL extends Record<string, (state: any) => any>>(selectors: SL) => {
  return function useGetState<K extends keyof SL>(selectorKey: K): ReturnType<SL[K]> {
    return useSelector((state: Parameters<SL[K]>[0]) => selectors[selectorKey](state));
  };
};

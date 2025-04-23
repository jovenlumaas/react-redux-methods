import { connect, InferableComponentEnhancerWithProps } from 'react-redux';

export type PropsFromConnector<C> = C extends (component: React.ComponentType<infer P>) => any ? P : never;

type MapSelectorReturnType<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R ? R : never;
};

type MapStateCallback<S> = (selectors: S) => Record<string, (state: any) => any>;
type MapDispatchCallback<A> = (actions: A) => Record<string, (...args: any[]) => any>;

const mapStateConnector = <S, MS extends MapStateCallback<S>>(
  selectors: S,
  mapState?: MS | null,
): ((state: any) => MapSelectorReturnType<ReturnType<MS>>) | undefined => {
  if (!mapState) return undefined;

  const selectedState = mapState(selectors);
  return (state: any) => {
    const result = {} as any;

    for (const key in selectedState) {
      if (selectedState[key]) {
        result[key] = selectedState[key](state);
      }
    }

    return result as MapSelectorReturnType<ReturnType<MS>>;
  };
};

const mapDispatchConnector = <A, MD extends MapDispatchCallback<A>>(
  actions: A,
  mapDispatch?: MD | null,
): ReturnType<MD> | undefined => {
  return mapDispatch ? (mapDispatch(actions) as ReturnType<MD>) : undefined;
};

export interface IReduxConnectorFn<S, A> {
  /**
   * ReduxConnector 'mapState' and 'mapDispatch' overload.
   *
   * This overload maps the selected state and action to the react component with typescript intellisense.
   */
  <MS extends MapStateCallback<S>, MD extends MapDispatchCallback<A>, TOwnProps>(
    mapState: MS,
    mapDispatch: MD,
  ): InferableComponentEnhancerWithProps<MapSelectorReturnType<ReturnType<MS>> & ReturnType<MD>, TOwnProps>;

  /**
   * ReduxConnector 'mapState' overload.
   *
   * This overload maps the selected state to the react component with typescript intellisense.
   */
  <MS extends MapStateCallback<S>, TOwnProps>(
    mapState: MS,
    mapDispatch?: null | undefined,
  ): InferableComponentEnhancerWithProps<MapSelectorReturnType<ReturnType<MS>>, TOwnProps>;

  /**
   * ReduxConnector 'mapDispatch' overload.
   *
   * This overload maps the selected action to the react component with typescript intellisense.
   */
  <MD extends MapDispatchCallback<A>, TOwnProps>(
    mapState: null | undefined,
    mapDispatch: MD,
  ): InferableComponentEnhancerWithProps<ReturnType<MD>, TOwnProps>;
}

/**
 * A utility function which simplifies redux's 'connect' boilerplate specifically when providing 'mapStateToProps' and/or 'mapDispatchToProps'
 * parameters. This function extends typescript intelliSense for passing props to react component.
 *
 * @param mapState A callback function that accepts a single parameter 'selectors' and returns an object of the selected
 *   case reducer states or what we call 'mapStateToProps'. The parameter contains all use case selections provided during the creation of each case reducer (
 *   see 'createReduxMethods' function for more reference).
 * @param mapDispatch Same to mapState, mapDispatch is a callback function with a single parameter-'actions' and returns an object
 *   called 'mapDispatchToProps'. This parameter provides the list of all available actions within redux context.
 * @returns a function returned from react-redux's 'connect'.
 *
 * EXAMPLE:
 * const connector = reduxConnector(
 *   (s) => ({
 *     savedSearchMutation: s.getSavedSearchMutation,
 *     accountingPeriodEntrySkipFetch: s.getAccountingPeriodEntrySkipFetch,
 *     currentUser: s.getCurrentUser,
 *   }),
 *   (a) => ({ openIsExport: a.openIsExport })
 * );
 */

export const createConnector = <S, A>(selectors: S, actions: A) => {
  return function connectWithMapFns<MS extends MapStateCallback<S>, MD extends MapDispatchCallback<A>>(
    mapState: MS,
    mapDispatch: MD,
  ) {
    const stateToProps = mapStateConnector(selectors, mapState);
    const dispatchToProps = mapDispatchConnector(actions, mapDispatch);

    const connector = connect(stateToProps, dispatchToProps);

    return connector;
  };
};

// export const createConnector = <S, A>(selectors: S, actions: A): IReduxConnectorFn<S, A> => {
//   return (mapState: any, mapDispatch: any) => {
//     const mapStateToProps = mapStateConnector(selectors, mapState);
//     const mapDispatchToProps = mapDispatchConnector(actions, mapDispatch);

//     return connect(mapStateToProps, mapDispatchToProps);
//   };
// };

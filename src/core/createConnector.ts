import { connect, InferableComponentEnhancerWithProps } from 'react-redux';

type MapStateCallback<S> = (allSelectors: S) => any;
type MapDispatchCallback<A> = (actions: A) => any;

type MapSelectorReturnType<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => infer R ? R : never;
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

const mapStateConnector = (selectors: any, mapState: any) => {
  let mapStateToProps = null;

  if (mapState) {
    mapStateToProps = (state: any) => {
      const selectedState = mapState(selectors);
      const selectedKeys = Object.keys(selectedState);
      return selectedKeys.reduce(
        (acc, key) => ({
          ...acc,
          [key]: selectedState[key](state),
        }),
        {},
      );
    };
  }

  return mapStateToProps as any;
};

const mapDispatchConnector = (actions: any, mapDispatch: any) => {
  let mapDispatchToProps;
  if (mapDispatch) mapDispatchToProps = mapDispatch(actions);
  return mapDispatchToProps;
};

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

export const createConnector = <S, A>(selectors: S, actions: A): IReduxConnectorFn<S, A> => {
  const reduxConnector = (mapState: any, mapDispatch: any) => {
    return connect<S, A>(mapStateConnector(selectors, mapState), mapDispatchConnector(actions, mapDispatch));
  };

  return reduxConnector;
};

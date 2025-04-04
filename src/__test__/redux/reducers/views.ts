import { createReduxMethods } from '../../../core';
import { ComposePayload } from '../../../types';

// types
export type TNetworkStatus = {
  isConnected: boolean;
  offlineAt: Date | null;
};

export type TViews = {
  collapse: boolean;
  isHydrated: boolean;
  isMobile: boolean | null;
  expandedIndex: false | number;
  networkStatus: TNetworkStatus;
};

// compose
export const viewsInitialState: TViews = {
  collapse: false,
  isHydrated: false,
  isMobile: null,
  expandedIndex: false,
  networkStatus: {
    isConnected: true,
    offlineAt: null,
  },
};

export const [viewsReducer, viewsActions, viewsSelectors] = createReduxMethods({
  initialState: viewsInitialState,
  reducers: {
    setCollapse: (s, a: ComposePayload<boolean>) => ({
      ...s,
      collapse: a.payload,
    }),
    setIsHydrated: (s) => ({ ...s, isHydrated: true }),
    setIsMobile: (s, { payload }: ComposePayload<boolean>) => ({
      ...s,
      isMobile: payload,
    }),
    setExpandedIndex: (s, a: ComposePayload<number | false>) => ({
      ...s,
      expandedIndex: a.payload,
    }),
    setNetworkStatus: (s, a: ComposePayload<TNetworkStatus>) => ({
      ...s,
      networkStatus: a.payload,
    }),
  },
  selectionNode: 'views',
  selectors: {
    getCollapse: (s) => s.collapse,
    getIsHydrated: (s) => s.isHydrated,
    getIsMobile: (s) => s.isMobile,
    getExpandedIndex: (s) => s.expandedIndex,
    getNetworkStatus: (s) => s.networkStatus,
  },
});

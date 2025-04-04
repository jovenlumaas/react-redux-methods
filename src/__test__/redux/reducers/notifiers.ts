

// types 
import { createReduxMethods } from "../../../core";
import { ComposePayload } from "../../../types";


// compose
type NotificationOptions = {
  toastId?: string;
  isShowMessage: boolean;
  theme: "colored" | "light" | "dark";
  variantType: "successTopCenter" | "successTopRight" | "errorTopCenter";
  messageText: string;
  autoClose: number;
  hideProgressBar: boolean;
  closeOnClick: boolean;
  limit: number;
  component: any;
  transition: "bounce" | "fade" | "flip" | "rotate" | "slide" | "zoom";
  clearQueue: boolean;
  delay?: number;
  closeButton: boolean;
  updateToast: boolean;
};

export const notifiersInitialState: NotificationOptions = {
  toastId: undefined,
  isShowMessage: false,
  theme: "colored",
  variantType: "successTopCenter",
  messageText: "",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: false,
  limit: 4,
  component: undefined,
  transition: "bounce",
  clearQueue: false,
  delay: undefined,
  closeButton: true,
  updateToast: false,
};

export const [notifiersReducer, notifiersActions, notifiersSelectors] =
  createReduxMethods({
    initialState: notifiersInitialState,
    reducers: {
      toastNotifierShow: (s, a: ComposePayload<NotificationOptions>) => ({
        ...s,
        ...a.payload,
        isShowMessage: true,
      }),
      toastNotifierHide: () => notifiersInitialState,
      toastNotifierUpdate: (s, a: ComposePayload<NotificationOptions>) => ({
        ...s,
        ...a.payload,
      }),
    },
    selectionNode: "notifiers",
    selectors: {
      getNotifier: (s) => s,
    },
  });

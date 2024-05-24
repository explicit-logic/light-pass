import { ActionType, dispatch } from './store';
import { type DefaultToastOptions, type Renderable, type Toast, type ToastOptions, type ToastType, resolveValue } from './types';
import { genId } from './utils';

type ToastHandler = (message: Renderable, options?: ToastOptions) => string;

const createToast = (message: Renderable, type: ToastType = 'blank', opts?: ToastOptions): Toast => ({
  createdAt: Date.now(),
  visible: true,
  type,
  message,
  pauseDuration: 1000,
  ...opts,
  id: opts?.id || genId(),
});

const createHandler =
  (type?: ToastType): ToastHandler =>
  (message, options) => {
    const toast = createToast(message, type, options);
    dispatch({ type: ActionType.UPSERT_TOAST, toast });
    return toast.id;
  };

const toast = (message: Renderable, opts?: ToastOptions) => createHandler('blank')(message, opts);

toast.error = createHandler('error');
toast.success = createHandler('success');

toast.dismiss = (toastId?: string) => {
  dispatch({
    type: ActionType.DISMISS_TOAST,
    toastId,
  });
};

toast.remove = (toastId?: string) => dispatch({ type: ActionType.REMOVE_TOAST, toastId });

export { toast };

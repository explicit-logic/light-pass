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
toast.loading = createHandler('loading');
toast.info = createHandler('info');
toast.message = createHandler('message');
toast.warning = createHandler('warning');

toast.dismiss = (toastId?: string) => {
  dispatch({
    type: ActionType.DISMISS_TOAST,
    toastId,
  });
};

toast.remove = (toastId?: string) => dispatch({ type: ActionType.REMOVE_TOAST, toastId });

toast.promise = <T>(
  promise: Promise<T>,
  msgs: {
    loading: Renderable;
    success: Renderable;
    error: Renderable;
  },
  opts?: DefaultToastOptions,
) => {
  const id = toast.loading(msgs.loading, { ...opts, ...opts?.loading });

  promise
    .then((p) => {
      toast.success(resolveValue(msgs.success, p), {
        id,
        ...opts,
        ...opts?.success,
      });
      return p;
    })
    .catch((e) => {
      toast.error(resolveValue(msgs.error, e), {
        id,
        ...opts,
        ...opts?.error,
      });
    });

  return promise;
};

export { toast };

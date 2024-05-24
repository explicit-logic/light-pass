'use client';
import type { Toast, ToastType } from '@/lib/toaster/types';
import { useToaster } from '@/lib/toaster/use-toaster';
import type { ReactElement } from 'react';
import { memo } from 'react';

// Components
import ToastBlank from '@/components/molecules/ToastBlank';
import ToastError from '@/components/molecules/ToastError';
import ToastSuccess from '@/components/molecules/ToastSuccess';

import ToastWrapper from '@/components/molecules/ToastWrapper';

const toastComponents: { blank: (t: Toast) => ReactElement } & { [key in ToastType]?: (t: Toast) => ReactElement } = {
  blank: (t) => <ToastBlank t={t} />,
  error: (t) => <ToastError t={t} />,
  success: (t) => <ToastSuccess t={t} />,
};

const getToastComponent = (t: Toast) => {
  const componentFn = toastComponents[t.type];
  if (componentFn) {
    return componentFn(t);
  }

  return toastComponents.blank(t);
};

function Toaster() {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9999,
        top: 20,
        left: 16,
        right: 16,
        bottom: 16,
        pointerEvents: 'none',
      }}
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts.map((t) => (
        <ToastWrapper key={t.id} t={t} handlers={handlers}>
          {getToastComponent(t)}
        </ToastWrapper>
      ))}
    </div>
  );
}

export default memo(Toaster);

import type { Toast, ToastPosition } from '@/lib/toaster/types';
import type { ReactNode } from 'react';

import { memo } from 'react';

type Handlers = {
  updateHeight: (toastId: string, height: number) => void;
  startPause: () => void;
  endPause: () => void;
  calculateOffset: (
    toast: Toast,
    opts?:
      | {
          reverseOrder?: boolean | undefined;
          gutter?: number | undefined;
          defaultPosition?: ToastPosition | undefined;
        }
      | undefined,
  ) => number;
};

function ToastWrapper(props: { children: ReactNode; handlers: Handlers; t: Toast }) {
  const { children, handlers, t } = props;
  const { calculateOffset, updateHeight } = handlers;

  const offset = calculateOffset(t, {
    reverseOrder: false,
    gutter: 8,
    defaultPosition: 'top-right',
  });

  const ref = (el: HTMLDivElement) => {
    if (el && typeof t.height !== 'number') {
      const height = el.getBoundingClientRect().height;
      updateHeight(t.id, height);
    }

    return el;
  };

  return (
    <div
      id={`t-${t.id}`}
      ref={ref}
      aria-live="polite"
      role="status"
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        left: 0,
        right: 0,
        top: 0,
        position: 'absolute',
        transition: 'all 0.5s ease-out',
        opacity: t.visible ? 1 : 0,
        transform: `translateY(${offset}px)`,
      }}
    >
      {children}
    </div>
  );
}

export default memo(ToastWrapper);

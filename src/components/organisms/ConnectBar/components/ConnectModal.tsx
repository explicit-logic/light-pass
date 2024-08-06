import type { Locale } from '@/models/Locale';

import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { QRCodeSVG } from 'qrcode.react';
import { memo } from 'react';
import { useLoaderData } from 'react-router-dom';

// Components
import ClipBoardField from '@/components/molecules/ClipboardField';

type Props = {
  close: () => void;
  isOpen: boolean;
};

function ConnectModal({ isOpen, close }: Props) {
  const { locale } = useLoaderData() as { locale: Locale };

  const peerId = 1;
  const connectionUrl = `${locale.url}?r=${peerId}`;

  return (
    <Transition
      show={isOpen}
      enter="duration-200 ease-out"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="duration-300 ease-out"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Dialog onClose={close} className="relative z-50 transition">
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-sm bg-white rounded-lg shadow dark:bg-gray-700">
            <DialogTitle as="div" className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Connection Link</h3>
              <button
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={close}
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </DialogTitle>
            <div className="p-4 space-y-6">
              <div className="flex flex-col items-center justify-center">
                <div className="p-3 bg-white rounded-md">
                  <QRCodeSVG size={150} value={connectionUrl} />
                </div>
              </div>
              <ClipBoardField value={connectionUrl} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}

export default memo(ConnectModal);

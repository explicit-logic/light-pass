import { toast } from '@/lib/toaster';
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { open } from '@tauri-apps/api/shell';
import { memo, useCallback, useState } from 'react';

import { identify } from '@/lib/github';

import ClipBoardField from '@/components/molecules/ClipboardField';

type Props = {
  close: () => void;
  onAuth: () => void;
  isOpen: boolean;
  deviceCode: string;
  userCode: string;
};

function GitHubOauthModal({ isOpen, deviceCode, userCode, close, onAuth }: Props) {
  const [ghActivationPageOpened, setGhActivationPageOpened] = useState(false);

  const openGhActivationPage = useCallback(async () => {
    await open('https://github.com/login/device');
    setGhActivationPageOpened(true);
  }, []);

  const gitHubOauthCheckStatus = useCallback(async () => {
    try {
      await identify(deviceCode);
      onAuth();
      close();
      toast.success('Authorized with GitHub');
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [deviceCode, close, onAuth]);

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
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-lg bg-white rounded-lg shadow dark:bg-gray-700">
            <DialogTitle as="div" className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Authorize with GitHub</h3>
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
            <div className="p-4 md:p-5 space-y-4">
              {ghActivationPageOpened ? (
                <button
                  type="button"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={gitHubOauthCheckStatus}
                >
                  Check the status
                </button>
              ) : (
                <>
                  <div>
                    <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Copy the following verification code:</p>
                    <ClipBoardField value={userCode} />
                    <p className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                      Navigate to the GitHub activation page and paste the code you copied.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={openGhActivationPage}
                  >
                    Open GitHub activation page
                  </button>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}

export default memo(GitHubOauthModal);

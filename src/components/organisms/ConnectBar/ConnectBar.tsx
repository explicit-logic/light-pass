import { memo, useCallback, useState } from 'react';
import ConnectModal from './components/ConnectModal';
import MessageModal from './components/MessageModal';

function ConnectBar() {
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  const openConnectModal = useCallback(() => {
    setConnectModalOpen(true);
  }, []);

  const closeConnectModal = useCallback(() => {
    setConnectModalOpen(false);
  }, []);

  const openMessageModal = useCallback(() => {
    setMessageModalOpen(true);
  }, []);

  const closeMessageModal = useCallback(() => {
    setMessageModalOpen(false);
  }, []);

  return (
    <>
      <div className="inline-flex space-x-2 justify-between px-2 py-2 border border-gray-200 rounded-lg shadow dark:border-gray-700">
        <button
          type="button"
          className="inline-flex items-center text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={openConnectModal}
        >
          <svg className="w-4 h-4 text-white me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"
            />
          </svg>
          Link
        </button>

        <button
          type="button"
          className="inline-flex items-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          onClick={openMessageModal}
        >
          <svg
            className="w-4 h-4 me-2 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M3 5.983C3 4.888 3.895 4 5 4h14c1.105 0 2 .888 2 1.983v8.923a1.992 1.992 0 0 1-2 1.983h-6.6l-2.867 2.7c-.955.899-2.533.228-2.533-1.08v-1.62H5c-1.105 0-2-.888-2-1.983V5.983Zm5.706 3.809a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Zm2.585.002a1 1 0 1 1 .003 1.414 1 1 0 0 1-.003-1.414Zm5.415-.002a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Z"
              clipRule="evenodd"
            />
          </svg>
          Message
        </button>
      </div>
      <ConnectModal isOpen={connectModalOpen} close={closeConnectModal} />
      <MessageModal isOpen={messageModalOpen} close={closeMessageModal} />
    </>
  );
}

export default memo(ConnectBar);

import { memo } from 'react';

// Components
import FinalMark from './FinalMark';
import RefreshButton from './RefreshButton';

function Footer() {
  return (
    <div className="fixed w-full left-0 bottom-0 py-4 bg-gray-800">
      <div className="flex flex-col px-3 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-6">
        <FinalMark />
        <div className="flex flex-row w-full sm:w-60">
          <RefreshButton />
          <button
            type="button"
            className="w-full py-3 text-base font-medium text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Evaluate
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(Footer);

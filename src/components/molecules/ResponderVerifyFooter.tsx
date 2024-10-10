import { memo } from 'react';

function ResponderVerifyFooter() {
  return (
    <div className="fixed w-full left-0 bottom-0 py-4 bg-gray-800">
      <div className="flex flex-col px-3 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-6">
        <div className="flex flex-row items-center justify-center space-x-4">
          <div className="text-2xl font-medium leading-6 text-gray-900 dark:text-white">Final Mark</div>
          <div className="flex flex-row space-x-1">
            <input
              type="text"
              inputMode="numeric"
              id="large-input"
              defaultValue={71}
              className="block w-20 px-4 text-gray-900 text-center border border-gray-300 rounded-lg bg-gray-50 text-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <div className="text-base font-medium leading-6 text-gray-900 dark:text-white py-3">&nbsp;/&nbsp;</div>
            <div className="text-xl font-medium leading-6 text-gray-900 dark:text-white py-3">
              <span>100</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="w-full sm:w-60 py-3 text-base font-medium text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Evaluate
        </button>
      </div>
    </div>
  );
}

export default memo(ResponderVerifyFooter);

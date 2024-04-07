import { writeText } from '@tauri-apps/api/clipboard';
import { useCallback, useState } from 'react';

const showIcon = (copied: boolean) => {
  if (copied) {
    return (
      <span id="success-icon" className="inline-flex items-center">
        <svg
          className="w-3.5 h-3.5 text-blue-700 dark:text-blue-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 16 12"
        >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
        </svg>
      </span>
    );
  }

  return (
    <span id="default-icon">
      <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
      </svg>
    </span>
  );
};

function ClipBoardField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = useCallback(async () => {
    setCopied(true);

    await writeText(value);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }, [value]);

  return (
    <div className="w-full">
      <div className="relative">
        <label htmlFor="npm-install-copy-button" className="sr-only">
          Copy
        </label>
        <input
          id="npm-install-copy-button"
          type="text"
          className="col-span-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={value}
          disabled
          readOnly
        />
        <button
          className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
          onClick={onClick}
          type="button"
        >
          {showIcon(copied)}
        </button>
        {/* <div id="tooltip-copy-npm-install-copy-button" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                <span id="default-tooltip-message">Copy to clipboard</span>
                <span id="success-tooltip-message" className="hidden">Copied!</span>
                <div className="tooltip-arrow" data-popper-arrow></div>
            </div> */}
      </div>
    </div>
  );
}

export default ClipBoardField;

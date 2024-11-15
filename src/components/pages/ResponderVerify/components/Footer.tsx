import { memo } from 'react';

// Components
import FinalMark from './FinalMark';
import RefreshButton from './RefreshButton';
import SubmitButton from './SubmitButton';

function Footer() {
  return (
    <div className="fixed w-full left-0 bottom-0 py-4 bg-gray-800">
      <div className="flex flex-col px-3 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-6">
        <FinalMark />
        <div className="flex flex-row w-full sm:w-60">
          <RefreshButton />
          <SubmitButton />
        </div>
      </div>
    </div>
  );
}

export default memo(Footer);

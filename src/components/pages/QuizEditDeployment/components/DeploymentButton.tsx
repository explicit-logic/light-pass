import type { Quiz } from '@/models/Quiz';
import { memo } from 'react';

import { MODES } from '@/constants/deployment';

const buttonText = {
  [MODES.CREATE]: 'Create',
  [MODES.UPDATE]: 'Update',
  [MODES.PROGRESS]: 'Continue',
};

function DeploymentButton({ mode, running }: { running: boolean; mode: Quiz['mode'] }) {
  if (running) {
    return (
      <button
        type="submit"
        className="w-52 px-2 py-2 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
      >
        Stop
      </button>
    );
  }

  const text = buttonText[mode];

  return (
    <button className="deploy-button w-52 px-2 py-2" type="submit">
      {text}
    </button>
  );
}

export default memo(DeploymentButton);

import type { Responder } from '@/models/Responder';

import { memo } from 'react';
import { useLoaderData } from 'react-router-dom';

function SubmitButton() {
  const { responder } = useLoaderData() as { responder: Responder };

  if (responder.verified) {
    return (
      <button
        type="submit"
        className="w-full py-3 text-base font-medium focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 rounded-lg dark:focus:ring-yellow-900"
      >
        Edit
      </button>
    );
  }

  return (
    <button
      type="submit"
      className="w-full py-3 text-base font-medium text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
    >
      Verify
    </button>
  );
}

export default memo(SubmitButton);

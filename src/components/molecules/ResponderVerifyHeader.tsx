import { memo, useCallback } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

import type { Responder } from '@/models/Responder';

function ResponderVerifyHeader() {
  const { responder } = useLoaderData() as { responder: Responder };
  const navigate = useNavigate();
  const goBack = useCallback(
    () => navigate(`/quizzes/${responder.quizId}/locales/${responder.language}/responders`),
    [responder.quizId, responder.language, navigate],
  );

  return (
    <div className="sticky z-10 top-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3">
      <div className="flex flex-row space-x-3">
        <button
          type="button"
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          onClick={goBack}
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h3 className="font-semibold leading-7 text-gray-900 text-2xl mb-2 dark:text-white" id="home">
            {responder.name}
          </h3>
          <p className="mt-1 max-w-2xl text-base leading-6 text-gray-500 dark:text-gray-400">{responder.email}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(ResponderVerifyHeader);

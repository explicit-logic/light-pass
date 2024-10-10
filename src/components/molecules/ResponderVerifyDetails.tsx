import type { Responder } from '@/models/Responder';

import { memo } from 'react';
import { useLoaderData } from 'react-router-dom';

// Helpers
import { getDuration } from '@/helpers/getDuration';

const getTimeText = (responder: Responder) => {
  const { startedAt, finishedAt } = responder;

  if (startedAt && finishedAt) {
    const dateStartedAt = new Date(startedAt);
    const dateFinishedAt = new Date(finishedAt);
    const parts = [dateStartedAt.toLocaleDateString(), dateStartedAt.toLocaleTimeString(), '-', dateFinishedAt.toLocaleTimeString()];

    return parts.join(' ');
  }

  return '--:--';
};

const getDurationText = (responder: Responder) => {
  const { startedAt, finishedAt } = responder;

  if (startedAt && finishedAt) {
    return getDuration(startedAt.valueOf(), finishedAt.valueOf());
  }

  return '--:--';
};

function ResponderVerifyDetails() {
  const { responder, slugs } = useLoaderData() as { responder: Responder; slugs: string[] };
  const timeText = getTimeText(responder);
  const durationText = getDurationText(responder);
  const progressText = responder.progress ? `${responder.progress} / ${slugs.length}` : '- / -';

  return (
    <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
      <dl>
        <div className="py-1 sm:grid sm:grid-cols-5">
          <dt className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Time</dt>
          <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 dark:text-gray-200">
            <time>{timeText}</time>
          </dd>
        </div>
        <div className="py-1 sm:grid sm:grid-cols-5">
          <dt className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Duration</dt>
          <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 dark:text-gray-200">
            <time>{durationText}</time>
          </dd>
        </div>
        <div className="py-1 sm:grid sm:grid-cols-5">
          <dt className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Progress</dt>
          <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 dark:text-gray-200">{progressText}</dd>
        </div>
      </dl>
    </div>
  );
}

export default memo(ResponderVerifyDetails);

import { useEffect, useState } from 'react';

import { getDuration } from '@/helpers/getDuration';

function TimeAgo({ date }: { date: Date }) {
  const [timeNow, setTimeNow] = useState<number>(date.valueOf());

  useEffect(() => {
    const tick = () => {
      return setTimeout(() => {
        setTimeNow(Date.now());
      }, 1000);
    };

    const timeoutId = tick();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const then = date.valueOf();

  return <time>{getDuration(then, timeNow)}</time>;
}

export default TimeAgo;

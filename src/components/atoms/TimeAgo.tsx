import { useEffect, useState } from 'react';

import { getDuration } from '@/helpers/getDuration';

function TimeAgo({ date }: { date: Date }) {
  const [timeNow, setTimeNow] = useState<number>(date.valueOf());

  useEffect(() => {
    const tick = () => {
      return setInterval(() => {
        setTimeNow(Date.now());
      }, 1000);
    };

    const intervalId = tick();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const then = date.valueOf();

  return <time className="block w-20">{getDuration(then, timeNow)}</time>;
}

export default TimeAgo;

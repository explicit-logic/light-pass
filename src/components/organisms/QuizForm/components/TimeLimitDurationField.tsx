import { memo, useCallback } from 'react';
import type { FieldError } from 'react-hook-form';

// Components
import DurationInput from '@/components/atoms/DurationInput';

type Props = {
  error: FieldError | undefined;
  hidden: boolean;
  value: number;
  onChange: (value: number) => void;
};

function TimeLimitDurationField(props: Props) {
  const { error, hidden, value, onChange } = props;

  const onTimeChange = useCallback(
    (value: string) => {
      onChange(parse(value));
    },
    [onChange],
  );

  if (hidden) {
    return (
      error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500" role="alert">
          {error?.message}
        </p>
      )
    );
  }

  const time = format(value);

  return (
    <>
      <label htmlFor="timeLimit.duration" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Duration
      </label>
      <div className="relative max-w-[12rem]">
        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Time</title>
            <path
              fillRule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DurationInput
          showSeconds
          className="w-full bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={onTimeChange}
          value={time}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500" role="alert">
          {error?.message}
        </p>
      )}
    </>
  );
}

function format(timeInSeconds: number) {
  const hours = Math.floor(timeInSeconds / 60 / 60);
  const minutes = Math.floor(timeInSeconds / 60) - hours * 60;
  const seconds = timeInSeconds % 60;

  return hours.toString().padStart(2, '0').concat(':', minutes.toString().padStart(2, '0'), ':', seconds.toString().padStart(2, '0'));
}

function parse(hms: string) {
  const [h, m, s] = hms.split(':');
  const totalSeconds = +h * 60 * 60 + +m * 60 + +s;

  return totalSeconds;
}

export default memo(TimeLimitDurationField);

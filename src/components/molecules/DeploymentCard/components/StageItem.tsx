import { memo } from 'react';

import { INDICATORS } from '@/constants/deployment';

/*
  running = true
    indicator | description
            0 | pending - gray circle
            1 | processing - loading spinner
            2 | success - green checkmark
            3 | error - yellow circle

  running = false
    indicator | description
            0 | pending - gray circle
            2 | success - gray checkmark
            3 | error - yellow circle
*/

interface Props {
  indicator: (typeof INDICATORS)[keyof typeof INDICATORS];
  label: string;
  running: boolean;
}

function StageItem({ indicator, label, running }: Props) {
  const icon = getIcon(indicator, running);

  return (
    <li className={`flex items-center ${indicator === INDICATORS.PENDING ? 'text-gray-500' : 'text-gray-300'}`}>
      {icon}
      {label}
    </li>
  );
}

function getIcon(indicator: (typeof INDICATORS)[keyof typeof INDICATORS], running: boolean) {
  if (indicator === INDICATORS.PENDING) {
    return <span className="block w-1.5 h-1.5 me-2 bg-gray-500 rounded-full flex-shrink-0" />;
  }

  if (indicator === INDICATORS.PROCESSING) {
    return (
      <svg
        className="animate-spin h-4 w-4 me-2"
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        version="1.1"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>loading</title>
        <path d="M16 8c-0.020-1.045-0.247-2.086-0.665-3.038-0.417-0.953-1.023-1.817-1.766-2.53s-1.624-1.278-2.578-1.651c-0.953-0.374-1.978-0.552-2.991-0.531-1.013 0.020-2.021 0.24-2.943 0.646-0.923 0.405-1.758 0.992-2.449 1.712s-1.237 1.574-1.597 2.497c-0.361 0.923-0.533 1.914-0.512 2.895 0.020 0.981 0.234 1.955 0.627 2.847 0.392 0.892 0.961 1.7 1.658 2.368s1.523 1.195 2.416 1.543c0.892 0.348 1.851 0.514 2.799 0.493 0.949-0.020 1.89-0.227 2.751-0.608 0.862-0.379 1.642-0.929 2.287-1.604s1.154-1.472 1.488-2.335c0.204-0.523 0.342-1.069 0.415-1.622 0.019 0.001 0.039 0.002 0.059 0.002 0.552 0 1-0.448 1-1 0-0.028-0.001-0.056-0.004-0.083h0.004zM14.411 10.655c-0.367 0.831-0.898 1.584-1.55 2.206s-1.422 1.112-2.254 1.434c-0.832 0.323-1.723 0.476-2.608 0.454-0.884-0.020-1.759-0.215-2.56-0.57-0.801-0.354-1.526-0.867-2.125-1.495s-1.071-1.371-1.38-2.173c-0.31-0.801-0.457-1.66-0.435-2.512s0.208-1.694 0.551-2.464c0.342-0.77 0.836-1.468 1.441-2.044s1.321-1.029 2.092-1.326c0.771-0.298 1.596-0.438 2.416-0.416s1.629 0.202 2.368 0.532c0.74 0.329 1.41 0.805 1.963 1.387s0.988 1.27 1.272 2.011c0.285 0.74 0.418 1.532 0.397 2.32h0.004c-0.002 0.027-0.004 0.055-0.004 0.083 0 0.516 0.39 0.94 0.892 0.994-0.097 0.544-0.258 1.075-0.481 1.578z" />
      </svg>
    );
  }

  if (indicator === INDICATORS.ERROR) {
    return <span className="block w-1.5 h-1.5 me-2 bg-amber-400 rounded-full flex-shrink-0" />;
  }

  return (
    <svg
      className={`${running ? 'text-green-400' : ''} w-3.5 h-3.5 me-2 flex-shrink-0`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
    </svg>
  );
}

export default memo(StageItem);

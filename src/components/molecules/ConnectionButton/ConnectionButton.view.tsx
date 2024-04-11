import { memo } from 'react';

const showIcon = (online: boolean) => {
  if (online) {
    return (
      <svg
        className="w-6 h-6 me-3"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        height="24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Online</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M6.528 6.536a6 6 0 0 0 7.942 7.933m2.247 -1.76a6 6 0 0 0 -8.427 -8.425" />
        <path d="M12 3c1.333 .333 2 2.333 2 6c0 .337 -.006 .66 -.017 .968m-.55 3.473c-.333 .884 -.81 1.403 -1.433 1.559" />
        <path d="M12 3c-.936 .234 -1.544 1.29 -1.822 3.167m-.16 3.838c.116 3.029 .776 4.695 1.982 4.995" />
        <path d="M6 9h3m4 0h5" />
        <path d="M3 20h7" />
        <path d="M14 20h7" />
        <path d="M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
        <path d="M12 15v3" />
        <path d="M3 3l18 18" />
      </svg>
    );
  }

  return (
    <svg
      className="w-6 h-6 me-3"
      stroke="currentColor"
      fill="none"
      width="24"
      height="24"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Offline</title>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 9a6 6 0 1 0 12 0a6 6 0 0 0 -12 0" />
      <path d="M12 3c1.333 .333 2 2.333 2 6s-.667 5.667 -2 6" />
      <path d="M12 3c-1.333 .333 -2 2.333 -2 6s.667 5.667 2 6" />
      <path d="M6 9h12" />
      <path d="M3 20h7" />
      <path d="M14 20h7" />
      <path d="M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <path d="M12 15v3" />
    </svg>
  );
};

function ConnectionButtonView(props: { onClick: () => void; online?: boolean }) {
  const { onClick, online = false } = props;
  const text = online ? 'Disconnect' : 'Connect';

  return (
    <button
      className="inline-flex py-3 px-5 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      type="button"
      onClick={onClick}
    >
      {showIcon(online)}
      {text}
    </button>
  );
}

export default memo(ConnectionButtonView);

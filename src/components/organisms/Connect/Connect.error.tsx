import { useAsyncError, useNavigate } from 'react-router-dom';

function ConnectError() {
  const error = useAsyncError();
  const navigate = useNavigate();

  const tryAgain = () => {
    navigate(0);
  };

  const message = error && typeof error === 'object' && 'message' in error ? (error.message as string) : '';

  return (
    <div className="flex flex-col items-center justify-center pt-12 w-full">
      <div className="mb-4">
        <svg
          className="w-24 h-24 text-amber-500"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Warning</title>
          <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z" />
        </svg>
      </div>
      <div className="w-96 text-center mb-8">
        <h1 className="mb-2 text-lg text-center font-bold dark:text-white">Connection is not established</h1>
        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">{message}</p>
      </div>
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={tryAgain}
      >
        Try Again
      </button>
    </div>
  );
}

export default ConnectError;

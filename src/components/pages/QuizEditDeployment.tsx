import { useCallback, useState } from 'react';

import { initDeviceOauth } from '@/api/github';
import { createForkRepo } from '@/lib/github';
import GitHubOauthModal from '../molecules/GitHubOauthModal';

export function Component() {
  const [isGitHubOauthModalOpen, setIsGitHubOauthModalOpen] = useState(false);
  const [userCode, setUserCode] = useState<string>('');
  const [deviceCode, setDeviceCode] = useState<string>('');
  const closeGitHubOauthModal = useCallback(() => setIsGitHubOauthModalOpen(false), []);
  const deploy = useCallback(async () => {
    const verification = await initDeviceOauth();
    setUserCode(verification.user_code);
    setDeviceCode(verification.device_code);
    setIsGitHubOauthModalOpen(true);
  }, []);

  const onAuth = useCallback(async () => {
    await createForkRepo();
  }, []);

  return (
    <>
      <div className="">
        <div className="w-full p-3 mb-4 text-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Deployment process</h2>
          <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
            <li className="flex items-center">
              <svg
                className="w-3.5 h-3.5 me-2 text-gray-500 dark:text-gray-400 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              Sign In to GitHub
            </li>
            <li className="flex items-center">
              <svg
                className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              Fork a template repository
            </li>
            <li className="flex items-center">
              <svg
                className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              Set Up Github Actions
            </li>
            <li className="flex items-center">
              <svg
                className="w-3.5 h-3.5 me-2 text-gray-500 dark:text-gray-400 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              Upload project files to GitHub
            </li>
            <li className="flex items-center">
              <svg
                className="w-3.5 h-3.5 me-2 text-gray-500 dark:text-gray-400 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              Build and deploy
            </li>
          </ul>
        </div>
        <button
          type="button"
          className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          onClick={deploy}
        >
          Deploy
        </button>

        <GitHubOauthModal
          close={closeGitHubOauthModal}
          onAuth={onAuth}
          deviceCode={deviceCode}
          isOpen={isGitHubOauthModalOpen}
          userCode={userCode}
        />
      </div>
    </>
  );
}

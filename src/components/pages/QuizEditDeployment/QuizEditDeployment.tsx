import { read as readConfiguration } from '@/api/configuration';
import { getMany as getDeploymentProcesses } from '@/api/deploymentProcess';
import { type Website, getMode, getWebsite, updateRepo } from '@/api/quizzes';
import { toast } from '@/lib/toaster';
import { useState } from 'react';
import { useCallback } from 'react';
import { type LoaderFunction, useLoaderData, useRevalidator, useRouteLoaderData } from 'react-router-dom';

import type { DeploymentProcess } from '@/models/DeploymentProcess';
import type { Quiz } from '@/models/Quiz';
import type { QuizConfiguration } from '@/models/QuizConfiguration';

import GlobeIcon from '@/components/atoms/GlobeIcon';

import RemovalModal from '@/components/molecules/RemovalModal';
import { useDeployment } from '@/hooks/useDeployment';
import DeploymentCard from '../../molecules/DeploymentCard';
import GitHubOauthModal from '../../molecules/GitHubOauthModal';
import DeploymentButton from './components/DeploymentButton';

import { INDICATORS, STAGES } from '@/constants/deployment';

export const loader: LoaderFunction = async ({ params }) => {
  const { quizId } = params as unknown as { quizId: string };
  const configuration = await readConfiguration(Number(quizId));

  const deploymentProcesses = await getDeploymentProcesses(Number(quizId));
  const mode = await getMode(Number(quizId));
  const website = await getWebsite(Number(quizId));

  return { configuration, deploymentProcesses, mode, website };
};

interface LoaderProps {
  configuration: QuizConfiguration;
  deploymentProcesses: DeploymentProcess[];
  mode: Quiz['mode'];
  website: Website;
}

export function Component() {
  const { deploymentProcesses, remove, running, start, stop, gitHubOauthModalProps } = useDeployment();
  const { configuration, mode, website } = useLoaderData() as LoaderProps;
  const { quiz } = useRouteLoaderData('quiz-edit') as { quiz: Quiz };
  const [removalModalOpen, setRemovalModalOpen] = useState(false);
  const revalidator = useRevalidator();

  const repoCreated = checkRepoCreated(deploymentProcesses);

  const onSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const target = event.target as typeof event.target & {
        repo: { value: string };
      };

      if (!running) {
        if (!quiz.deployed && !repoCreated && target?.repo?.value) {
          await updateRepo(quiz.id, target.repo.value);
          revalidator.revalidate();
        }

        await start();
      } else {
        await stop('button pressed');
      }
    },
    [quiz.deployed, quiz.id, repoCreated, running, start, stop, revalidator],
  );

  const closeRemovalModal = useCallback(() => {
    setRemovalModalOpen(false);
  }, []);

  const onRemove = useCallback(async () => {
    await remove();
    closeRemovalModal();
  }, [closeRemovalModal, remove]);

  return (
    <>
      <div className="w-full p-3 mb-4 text-center border border-gray-200 rounded-lg shadow  dark:border-gray-800">
        <div className="max-w-lg m-auto mb-4">
          <DeploymentCard deploymentProcesses={deploymentProcesses} running={running} mode={mode} />
        </div>

        <form className="flex items-center max-w-lg mx-auto justify-between" onSubmit={onSubmit}>
          {(repoCreated || quiz.deployed) && !running ? (
            <button
              type="button"
              className="px-9 py-2.5 text-sm text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
              onClick={() => setRemovalModalOpen(true)}
            >
              Remove
            </button>
          ) : (
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <GlobeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                id="repo"
                name="repo"
                autoComplete="off"
                spellCheck="false"
                autoCapitalize="off"
                autoCorrect="off"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Website address"
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                title="a-z0-9 and dash (-) are allowed"
                defaultValue={website.repo}
                disabled={running || repoCreated || quiz.deployed}
                required
              />
            </div>
          )}
          <div className="ms-4">
            <DeploymentButton mode={mode} running={running} />
          </div>
        </form>
      </div>
      <RemovalModal
        isOpen={removalModalOpen}
        close={closeRemovalModal}
        message="Are you sure you want to delete this website?"
        onRemove={onRemove}
      />
      <GitHubOauthModal {...gitHubOauthModalProps} />
    </>
  );
}

function checkRepoCreated(deploymentProcesses: DeploymentProcess[]) {
  const process = deploymentProcesses.find(({ stage }) => stage === STAGES.GENERATE_REPO);

  return process && process.indicator === INDICATORS.SUCCESS;
}

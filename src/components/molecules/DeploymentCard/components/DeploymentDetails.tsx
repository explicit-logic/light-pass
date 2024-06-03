import { open } from '@tauri-apps/api/shell';
import { memo, useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';

import type { Website } from '@/api/quizzes';
import type { DeploymentProcess } from '@/models/DeploymentProcess';

import { INDICATORS, STAGES } from '@/constants/deployment';

interface Props {
  deploymentProcesses: DeploymentProcess[];
  running: boolean;
}

function DeploymentDetails({ deploymentProcesses }: Props) {
  const { website } = useLoaderData() as { website: Website };
  const { owner, repo } = website;

  const actionsLink = `https://github.com/${owner}/${repo}/actions`;

  const openActions = useCallback(async () => {
    await open(actionsLink);
  }, [actionsLink]);

  if (!owner || !repo) return;

  const buildProcessing = checkBuildProcessing(deploymentProcesses);

  if (!buildProcessing) return;

  return (
    <div className="border-l-4 border-indigo-700 ml-3 text-left px-2 space-y-1 text-sm">
      <p className="text-gray-400">See deployment details here:</p>
      <p>
        <button type="button" className="underline text-white" onClick={openActions}>
          {actionsLink}
        </button>
      </p>
    </div>
  );
}

function checkBuildProcessing(deploymentProcesses: DeploymentProcess[]) {
  const buildProcess = deploymentProcesses.find(({ stage }) => stage === STAGES.BUILD);

  return buildProcess && buildProcess.indicator === INDICATORS.PROCESSING;
}

export default memo(DeploymentDetails);

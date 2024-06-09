import { memo } from 'react';

import { STAGE_LABELS } from '@/constants/deployment';
import type { DeploymentProcess } from '@/models/DeploymentProcess';

import DeploymentDetails from './DeploymentDetails';
import StageItem from './StageItem';
import WebsiteList from './WebsiteList';

interface Props {
  deploymentProcesses: DeploymentProcess[];
  running: boolean;
}

function DeploymentProcessComponent(props: Props) {
  const { deploymentProcesses, running } = props;

  return (
    <div className="max-w-lg bg-black rounded-md h-80 mx-auto border-2 border-gray-600 overflow-auto">
      <div className="w-full bg-gray-800 h-6 py-0.5 rounded-t-sm">
        <h1 className="text-white text-center text-sm font-medium">Deployment Process</h1>
      </div>
      <div className="p-3">
        <ul className="max-w-md space-y-1 text-sm list-inside">
          {deploymentProcesses.map(({ indicator, stage }) => (
            <StageItem key={stage} label={STAGE_LABELS[stage]} indicator={indicator} running={running} />
          ))}
        </ul>
      </div>
      <DeploymentDetails {...props} />
      <WebsiteList running={running} />
    </div>
  );
}

export default memo(DeploymentProcessComponent);

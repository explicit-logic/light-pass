import deploymentImage from '@/assets/deployment.png';
import { memo } from 'react';
import DeploymentProcessComponent from './components/DeploymentProcess';

import { MODES } from '@/constants/deployment';

import type { DeploymentProcess } from '@/models/DeploymentProcess';
import type { Quiz } from '@/models/Quiz';

function DeploymentCard({
  deploymentProcesses,
  mode,
  running,
}: { deploymentProcesses: DeploymentProcess[]; running: boolean; mode: Quiz['mode'] }) {
  if (mode !== MODES.CREATE) {
    return <DeploymentProcessComponent deploymentProcesses={deploymentProcesses} running={running} />;
  }

  return (
    <div className="h-80 w-full [perspective:1000px]">
      <div
        className={`relative h-full w-full rounded-md shadow-md transition-all duration-1000 [transform-style:preserve-3d] ${
          running ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        <div className="absolute inset-0">
          <img alt="Deployment process" className="h-full w-full rounded-md object-cover shadow-xl shadow-black/40" src={deploymentImage} />
        </div>
        <div className="absolute inset-0 w-full [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <DeploymentProcessComponent deploymentProcesses={deploymentProcesses} running={running} />
        </div>
      </div>
    </div>
  );
}

export default memo(DeploymentCard);

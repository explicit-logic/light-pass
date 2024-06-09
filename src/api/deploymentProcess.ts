import { invoke } from '@tauri-apps/api';

import { type CREATE_STRATEGY, INDICATORS, type UPDATE_STRATEGY } from '@/constants/deployment';
import { DeploymentProcess } from '@/models/DeploymentProcess';

export type DeploymentProcessCreate = Pick<DeploymentProcess, 'quizId' | 'stage' | 'indicator' | 'order'>;

export async function init(quizId: DeploymentProcess['quizId'], strategy: typeof CREATE_STRATEGY | typeof UPDATE_STRATEGY) {
  const items = await getMany(quizId);

  if (items.length) return items;

  const deploymentProcesses = [];
  let order = 0;
  for (const stage of strategy) {
    const deploymentProcess = await upsert({ quizId, stage, indicator: INDICATORS.PENDING, order });
    deploymentProcesses.push(deploymentProcess);
    order += 1;
  }

  return deploymentProcesses;
}

export async function getMany(quizId: DeploymentProcess['quizId']) {
  const items = (await invoke('deployment_process_many', { quizId })) as DeploymentProcess[];
  if (!items) return [];

  return items.map((item) => new DeploymentProcess(item));
}

export async function upsert(data: DeploymentProcessCreate) {
  const deploymentProcess = (await invoke('deployment_process_upsert', data)) as DeploymentProcess;

  return new DeploymentProcess(deploymentProcess);
}

type UpdateIndicator = {
  quizId: DeploymentProcess['quizId'];
  stage: DeploymentProcess['stage'];
  indicator: typeof INDICATORS.ERROR | typeof INDICATORS.PENDING | typeof INDICATORS.SUCCESS;
};

export async function updateIndicator(data: UpdateIndicator) {
  await invoke('deployment_process_update_indicator', data);
}

export async function reset(quizId: DeploymentProcess['quizId']) {
  await invoke('deployment_process_reset', { quizId });
}

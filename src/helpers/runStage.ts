import { build } from '@/lib/github/build';
import { enablePages } from '@/lib/github/enablePages';
import { generateRepo } from '@/lib/github/generateRepo';
import { pushContent } from '@/lib/github/pushContent';

// Constants
import { STAGES } from '@/constants/deployment';

// Types
import type { ProcessParams, StageHandlers } from '@/types/deployment.types';

const handlers: StageHandlers = {
  [STAGES.GENERATE_REPO]: generateRepo,
  [STAGES.ENABLE_PAGES]: enablePages,
  [STAGES.PUSH_CONTENT]: pushContent,
  [STAGES.BUILD]: build,
};

export async function runStage(stage: (typeof STAGES)[keyof typeof STAGES], params: ProcessParams) {
  const handler = handlers[stage];

  if (handler) {
    return handler(params);
  }
}

import { sleep } from '@/helpers/sleep';

// Types
import type { ProcessParams } from '@/types/deployment.types';

export async function build(params: ProcessParams) {
  await sleep(120_000);
}

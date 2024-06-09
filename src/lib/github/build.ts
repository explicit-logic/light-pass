import { sleep } from '@/helpers/sleep';

// Types
import type { ProcessParams } from '@/types/deployment.types';

export async function build() {
  await sleep(120_000);
}

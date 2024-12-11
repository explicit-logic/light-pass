import { TauriEvent, listen } from '@tauri-apps/api/event';
import { type Child, Command } from '@tauri-apps/api/shell';

import { promiseWithTimeout } from '@/helpers/promiseWithTimeout';

// Config
import { PORT } from './config';

let serverProcess: Child;

const TIMEOUT = 60_000;

export async function start() {
  if (serverProcess) {
    return;
  }

  try {
    const command = Command.sidecar('binaries/light-ai/light-ai', ['-p', PORT]);
    await promiseWithTimeout(TIMEOUT, async (resolve, reject) => {
      command.stdout.on('data', (data) => {
        if (data.toLowerCase().includes('running:')) {
          resolve();
        }
        console.log(`${data}\n`);
      });

      command.stderr.on('data', (data) => {
        console.error(`${data}\n`);

        reject(data);
      });
      serverProcess = await command.spawn();
    });
  } catch (error) {
    console.error(error);
  }

  listen(TauriEvent.WINDOW_DESTROYED, () => {
    serverProcess.kill();
  });

  // const output = await command.execute();
}

export async function restart() {
  if (serverProcess) {
    serverProcess.kill();
  }

  await start();
}

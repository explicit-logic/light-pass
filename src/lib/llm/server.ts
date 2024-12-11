import { TauriEvent, listen } from '@tauri-apps/api/event';
import { exists, readDir, readTextFile } from '@tauri-apps/api/fs';
import { appDataDir, join } from '@tauri-apps/api/path';
import { type Child, Command } from '@tauri-apps/api/shell';

// Config
import { CONTEXT_SIZE, GPU_LAYERS, HOST, PORT, THREADS } from './config';

let serverProcess: Child;

export async function start() {
  if (serverProcess) {
    return;
  }
  const appDataDirPath = await appDataDir();
  const modelPath = await join(...[appDataDirPath, 'Llama-3.2-1B-Instruct-GGUF', 'Llama-3.2-1B-Instruct-Q8_0.gguf']);
  console.log(modelPath);
  const command = Command.sidecar('binaries/llama.cpp/llama.cpp.server', [
    '-m',
    modelPath,
    '--port',
    PORT,
    '--host',
    HOST,
    '-c',
    CONTEXT_SIZE,
    '-t',
    THREADS,
    '-ngl',
    GPU_LAYERS,
  ]);

  command.stdout.on('data', (data) => {
    // console.log(data + '\n');
  });

  command.stderr.on('data', (data) => {
    console.log(`${data}\n`);
  });

  serverProcess = await command.spawn();

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

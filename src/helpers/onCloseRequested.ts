// import type { UnlistenFn } from '@tauri-apps/api/event';
import { confirm } from '@tauri-apps/api/dialog';
import { appWindow } from '@tauri-apps/api/window';

// Store
import { getServer } from '@/lib/peer/store';

export async function onCloseRequested() {
  await appWindow.onCloseRequested(async (event) => {
    const peer = getServer();
    if (!peer) {
      return;
    }

    const confirmed = await confirm('Are you sure want to exit? \n All connections will be lost');

    if (confirmed) {
      peer.disconnect();
      peer.destroy();
    } else {
      // user did not confirm closing the window; let's prevent it
      event.preventDefault();
    }
  });
}

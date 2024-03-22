// import type { UnlistenFn } from '@tauri-apps/api/event';
import { confirm } from '@tauri-apps/api/dialog';
import { appWindow } from '@tauri-apps/api/window';

// Store
import { getSender } from '../lib/peer/store';

export async function onCloseRequested() {
  await appWindow.onCloseRequested(async (event) => {
    const peer = getSender();
    if (!peer) {
      event.preventDefault();
      return;
    }

    const confirmed = await confirm('Are you sure?');

    if (confirmed) {
      peer.disconnect();
      peer.destroy();
    } else {
      // user did not confirm closing the window; let's prevent it
      event.preventDefault();
    }
  });
}

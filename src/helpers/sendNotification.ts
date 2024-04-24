import { isPermissionGranted, requestPermission, sendNotification as send } from '@tauri-apps/api/notification';

export async function sendNotification(title: string, body?: string) {
  let permissionGranted = await isPermissionGranted();
  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === 'granted';
  }

  if (permissionGranted) {
    if (!body) {
      return send(title);
    }
    send({ title, body });
  }
}

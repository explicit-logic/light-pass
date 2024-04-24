import { isPermissionGranted, requestPermission } from '@tauri-apps/api/notification';

export async function requestNotificationPermission() {
  const permissionGranted = await isPermissionGranted();
  if (!permissionGranted) {
    await requestPermission();
  }
}

import { invoke } from '@tauri-apps/api';

export type Verification = {
  user_code: string;
  device_code: string;
};

export async function initDeviceOauth() {
  return await invoke<Verification>('init_device_oauth');
}

export async function checkAuthStatus(params: { deviceCode: string }) {
  return await invoke<string>('check_auth_status', params);
}

export async function requestAccessToken() {
  try {
    return await invoke<string>('request_access_token');
  } catch (error) {
    console.error(error);
  }
}

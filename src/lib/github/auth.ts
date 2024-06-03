import { checkAuthStatus, requestAccessToken } from '@/api/github';
import { request } from './request';

let _accessToken: string | undefined;

export async function identify(deviceCode: string) {
  const accessToken = await checkAuthStatus({ deviceCode });
  _accessToken = accessToken;

  return accessToken;
}

export async function getAccessToken() {
  if (_accessToken) {
    return _accessToken;
  }

  const accessToken = await requestAccessToken();
  _accessToken = accessToken;

  return _accessToken;
}

export async function getAuthenticated() {
  try {
    const user = await request<{ login: string }>('/user', {
      method: 'GET',
    });

    return user;
  } catch (error) {
    console.error(error);
  }
}

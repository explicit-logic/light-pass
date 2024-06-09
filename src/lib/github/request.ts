import { getAccessToken } from './auth';

const API_URL = 'https://api.github.com';

export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONValue };
export type JSONArray = Array<JSONValue>;

export async function request<T>(url: string, options: RequestInit): Promise<T> {
  const { headers, ...restOptions } = options;
  const accessToken = await getAccessToken();

  const requestOptions = {
    ...restOptions,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    signal: AbortSignal.timeout(180_000),
  };
  const response = await fetch(API_URL.concat(url), requestOptions);

  if (response.ok) {
    try {
      return (await response.json()) as T;
    } catch {
      return undefined as T;
    }
  }

  return Promise.reject(await responseError(response));
}

async function responseError(response: Response) {
  const { status, statusText, redirected, type, url, headers } = response;
  let body: JSONObject | string | undefined;
  let text: string | undefined;

  let message = `${status} ${statusText}`;

  if (!response.bodyUsed && response.text && response.text instanceof Function) {
    text = await response.text();
    try {
      body = JSON.parse(text) as { message: string };
      if (body?.message) {
        message = (body as { message: string })?.message;
      }
    } catch {
      body = text;
      message = text;
    }
  }

  return {
    body,
    message,
    redirected,
    status,
    statusText,
    type,
    url,
    headers: headers?.entries && Object.fromEntries(Array.from(headers.entries())),
  };
}

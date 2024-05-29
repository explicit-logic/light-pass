import { Octokit } from '@octokit/rest';

import { checkAuthStatus } from '@/api/github';

let octokit: Octokit | undefined;
let accessToken: string | undefined;

export async function identify(deviceCode: string) {
  const accessToken = await checkAuthStatus({ deviceCode });
  setAccessToken(accessToken);

  octokit = new Octokit({
    auth: accessToken,
    userAgent: 'LightPass',
    baseUrl: 'https://api.github.com',
  });

  const rsp = await octokit.users.getAuthenticated();

  return rsp.data.login;
}

export async function createForkRepo() {
  if (!octokit) {
    throw new Error('GitHub API not initialized');
  }

  const response = await octokit.request('POST /repos/explicit-logic/light-pass-template/forks', {
    name: 'forked-light-pass-test',
    default_branch_only: true,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  console.log(response);

  return response.data;
}

function setAccessToken(token: string) {
  accessToken = token;
}

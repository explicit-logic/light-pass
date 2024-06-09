import { toast } from '@/lib/toaster';
import { useCallback, useRef, useState } from 'react';
import { useLoaderData, useParams, useRevalidator, useRouteLoaderData } from 'react-router-dom';

// API
import { init, reset } from '@/api/deploymentProcess';
import { updateIndicator as apiUpdateIndicator } from '@/api/deploymentProcess';
import { initDeviceOauth } from '@/api/github';
import { updateUrl } from '@/api/locales';
import { type Website, getWebsite, updateMode, updateOwner, updateState } from '@/api/quizzes';
import { getAuthenticated } from '@/lib/github/auth';
import { deleteRepo } from '@/lib/github/deleteRepo';

// Constants
import { CREATE_STRATEGY, INDICATORS, MODES, STAGES, UPDATE_STRATEGY } from '@/constants/deployment';
import { STATES } from '@/constants/quizzes';

// Helpers
import { abortable } from '@/helpers/abortable';
import { runStage } from '@/helpers/runStage';
import { sleep } from '@/helpers/sleep';

// Types
import type { DeploymentProcess } from '@/models/DeploymentProcess';
import type { Locale } from '@/models/Locale';
import type { Quiz } from '@/models/Quiz';
import type { QuizConfiguration } from '@/models/QuizConfiguration';
import type { ProcessParams } from '@/types/deployment.types';

interface LoaderProps {
  configuration: QuizConfiguration;
  deploymentProcesses: DeploymentProcess[];
  mode: Quiz['mode'];
  website: Website;
}

const AUTH_ACTIONS = {
  LOGIN: 'login',
  REMOVE: 'remove',
} as const;

export function useDeployment() {
  const params = useParams() as { quizId: string };
  const quizId = Number(params.quizId);
  const { locales } = useRouteLoaderData('quiz-edit') as { locales: Locale[]; quiz: Quiz };
  const { deploymentProcesses: initDeploymentProcesses, mode } = useLoaderData() as LoaderProps;
  const abortRef = useRef<AbortController>();
  const [deploymentProcesses, setDeploymentProcesses] = useState<DeploymentProcess[]>(() => initDeploymentProcesses);
  const [running, setRunning] = useState(false);
  const [authAction, setAuthAction] = useState<(typeof AUTH_ACTIONS)[keyof typeof AUTH_ACTIONS]>(AUTH_ACTIONS.LOGIN);
  const revalidator = useRevalidator();

  const [isGitHubOauthModalOpen, setIsGitHubOauthModalOpen] = useState(false);
  const [userCode, setUserCode] = useState<string>('');
  const [deviceCode, setDeviceCode] = useState<string>('');

  const closeGitHubOauthModal = useCallback(() => setIsGitHubOauthModalOpen(false), []);

  const updateIndicator = useCallback(
    async (stage: DeploymentProcess['stage'], indicator: DeploymentProcess['indicator']) => {
      setDeploymentProcesses((prev) => {
        const newDeploymentProcesses = [...prev];

        for (const deploymentProcess of newDeploymentProcesses) {
          if (deploymentProcess.stage === stage) {
            deploymentProcess.indicator = indicator;
            break;
          }
        }

        return newDeploymentProcesses;
      });

      if (indicator !== INDICATORS.PROCESSING) {
        await apiUpdateIndicator({
          quizId,
          stage,
          indicator,
        });
      }
    },
    [quizId],
  );

  const stop = useCallback(
    async (reason: string) => {
      console.warn(reason);
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const processingStage = getProcessingStage(deploymentProcesses);
      if (processingStage) {
        await updateIndicator(processingStage, INDICATORS.PENDING);
      }
      revalidator.revalidate();
      setRunning(false);
      closeGitHubOauthModal();
    },
    [closeGitHubOauthModal, deploymentProcesses, updateIndicator, revalidator],
  );

  const onError = useCallback(
    async (error: unknown) => {
      console.error(error);
      await updateIndicator(STAGES.LOGIN, INDICATORS.ERROR);
      const message = (error as Error)?.message ?? error;
      toast.error(message);
      await stop('GitHub API Error');
    },
    [stop, updateIndicator],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies(processStage): recursion
  const processStage = useCallback(
    async (deploymentProcesses: DeploymentProcess[], params: ProcessParams) => {
      const stage = getNextStage(deploymentProcesses);
      if (!stage) {
        return await stop('no more stages');
      }
      try {
        await updateIndicator(stage, INDICATORS.PROCESSING);

        await runStage(stage, params);

        if (stage === STAGES.GENERATE_REPO) {
          revalidator.revalidate();
          await sleep(5_000);
        }

        await updateIndicator(stage, INDICATORS.SUCCESS);
      } catch (error) {
        await updateIndicator(stage, INDICATORS.ERROR);
        throw error;
      }

      await processStage(deploymentProcesses, params);
    },
    [deploymentProcesses, locales, revalidator, stop],
  );

  const afterLogin = useCallback(
    async (params: { deploymentProcesses: DeploymentProcess[]; owner: string; repo: string }) => {
      const { deploymentProcesses, owner, repo } = params;

      try {
        await updateOwner(quizId, owner);
        await updateIndicator(STAGES.LOGIN, INDICATORS.SUCCESS);
        toast.success('Authorized with GitHub');
      } catch (error) {
        console.log(error);
        const message = (error as Error)?.message ?? error;
        toast.error(message);

        await updateIndicator(STAGES.LOGIN, INDICATORS.ERROR);
        await stop('after login - update indicator');
        return;
      }

      const abortController = new AbortController();
      const abortSignal = abortController.signal;
      abortRef.current = abortController;

      try {
        await abortable(
          async () => {
            await processStage(deploymentProcesses, {
              owner,
              repo,
              quizId,
            });

            await updateLocaleUrls(locales, {
              quizId,
              owner,
              repo,
            });

            await updateState(quizId, STATES.DEPLOYED, true);
            await updateMode(quizId, MODES.UPDATE);

            revalidator.revalidate();
          },
          { signal: abortSignal },
        );
      } catch (error) {
        console.error(error);
        if ((error as Error)?.name !== 'AbortError') {
          const message = (error as Error)?.message ?? error;
          toast.error(message);
          await stop('error - after login');
        }
      }
    },
    [updateIndicator, locales, processStage, revalidator, stop, quizId],
  );

  const onAuthLogin = useCallback(
    async (user: { login: string }) => {
      const { repo } = await getWebsite(quizId);
      if (!user.login || !repo) {
        toast.error('Primary params are not set');
        await stop('onAuth - no params');

        return;
      }

      await afterLogin({
        deploymentProcesses,
        owner: user.login,
        repo,
      });

      console.log(user);
    },
    [afterLogin, deploymentProcesses, quizId, stop],
  );

  const onAuthRemove = useCallback(
    async (user: { login: string }) => {
      try {
        const { repo } = await getWebsite(quizId);
        await deleteRepo({ owner: user.login, repo });
        await reset(quizId);
        await updateMode(quizId, MODES.CREATE);
        await updateState(quizId, STATES.DEPLOYED, false);
        setDeploymentProcesses(() => []);
        setRunning(false);
        revalidator.revalidate();

        toast('Website removed');
      } catch (error) {
        console.error(error);
        const message = (error as Error)?.message ?? error;
        toast.error(message);
      }
    },
    [revalidator, quizId],
  );

  const getOnAuth = () => {
    if (authAction === AUTH_ACTIONS.LOGIN) {
      return onAuthLogin;
    }

    if (authAction === AUTH_ACTIONS.REMOVE) {
      return onAuthRemove;
    }

    return () => {};
  };

  const onAuth = getOnAuth();

  const login = useCallback(
    async (params: { deploymentProcesses: DeploymentProcess[] }) => {
      const abortController = new AbortController();
      const abortSignal = abortController.signal;
      abortRef.current = abortController;

      try {
        await abortable(
          async () => {
            await updateIndicator(STAGES.LOGIN, INDICATORS.PROCESSING);
            const user = await getAuthenticated();

            if (!user) {
              const verification = await initDeviceOauth();
              setUserCode(verification.user_code);
              setDeviceCode(verification.device_code);
              setAuthAction(AUTH_ACTIONS.LOGIN);
              setIsGitHubOauthModalOpen(true);
            } else {
              const { repo } = await getWebsite(quizId);
              await afterLogin({
                deploymentProcesses: params.deploymentProcesses,
                owner: user.login,
                repo,
              });
            }
          },
          { signal: abortSignal },
        );
      } catch (error: unknown) {
        console.error(error);
        if ((error as Error)?.name !== 'AbortError') {
          await updateIndicator(STAGES.LOGIN, INDICATORS.ERROR);
          await stop('login error');
          const message = (error as Error)?.message ?? error;
          toast.error(message);
        }
      }
    },
    [afterLogin, updateIndicator, stop, quizId],
  );

  const start = useCallback(async () => {
    let deploymentProcesses = initDeploymentProcesses;

    try {
      if (!deploymentProcesses.length) {
        deploymentProcesses = await init(quizId, CREATE_STRATEGY);
      } else if (mode === MODES.UPDATE) {
        await reset(quizId);
        deploymentProcesses = await init(quizId, UPDATE_STRATEGY);
      }
      setDeploymentProcesses(() => deploymentProcesses);
      await updateMode(quizId, MODES.PROGRESS);
      setRunning(true);
    } catch (error) {
      const message = (error as Error)?.message ?? error;
      toast.error(message);
      await stop('error on start');
    }

    await login({ deploymentProcesses });
  }, [initDeploymentProcesses, quizId, login, mode, stop]);

  const remove = useCallback(async () => {
    const user = await getAuthenticated();
    setAuthAction(() => AUTH_ACTIONS.REMOVE);

    if (!user) {
      const verification = await initDeviceOauth();
      setUserCode(verification.user_code);
      setDeviceCode(verification.device_code);
      setIsGitHubOauthModalOpen(true);
    } else {
      await onAuthRemove(user);
    }
  }, [onAuthRemove]);

  return {
    deploymentProcesses,
    remove,
    running,
    gitHubOauthModalProps: {
      close: closeGitHubOauthModal,
      isOpen: isGitHubOauthModalOpen,
      userCode,
      deviceCode,
      onAuth,
      onError,
    },
    start,
    stop,
  };
}

function getNextStage(deploymentProcesses: DeploymentProcess[]): DeploymentProcess['stage'] | undefined {
  for (const deploymentProcess of deploymentProcesses) {
    if (deploymentProcess.indicator === INDICATORS.ERROR || deploymentProcess.indicator === INDICATORS.PENDING) {
      return deploymentProcess.stage;
    }
  }
}

function getProcessingStage(deploymentProcesses: DeploymentProcess[]): DeploymentProcess['stage'] | undefined {
  for (const deploymentProcess of deploymentProcesses) {
    if (deploymentProcess.indicator === INDICATORS.PROCESSING) {
      return deploymentProcess.stage;
    }
  }
}

async function updateLocaleUrls(locales: Locale[], { owner, repo, quizId }: { owner: string; repo: string; quizId: number }) {
  for (const { language } of locales) {
    await updateUrl({
      quizId,
      language,
      url: `https://${owner}.github.io/${repo}/${language}`,
    });
  }
}

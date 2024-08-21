import { useCallback } from 'react';

// Api
import { updateProgress } from '@/api/responders';

// Constants
import { TYPES as MESSAGE_TYPES } from '@/constants/message';

export function useProgressHandler() {
  const handler = useCallback(async (clientId: Client['id'], message: Message) => {
    const { quizId, data } = message as Messages.Progress;
    const { current } = data;

    await updateProgress({
      quizId,
      clientId,
      progress: current,
    });
  }, []);

  return [MESSAGE_TYPES.progress, handler] as const;
}

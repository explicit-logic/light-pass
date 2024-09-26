import { useCallback } from 'react';

// Api
import { save as saveAnswer } from '@/api/answers';
import { updateProgress } from '@/api/responders';

// Constants
import { TYPES as MESSAGE_TYPES } from '@/constants/message';

export function useProgressHandler() {
  const handler = useCallback(async (clientId: Client['id'], message: Message) => {
    const { quizId, data } = message as Messages.Progress;
    const { current, page, answer } = data;

    const responder = await updateProgress({
      quizId,
      clientId,
      progress: current,
    });

    await saveAnswer({
      answer,
      responderId: responder.id,
      page,
    });
  }, []);

  return [MESSAGE_TYPES.progress, handler] as const;
}

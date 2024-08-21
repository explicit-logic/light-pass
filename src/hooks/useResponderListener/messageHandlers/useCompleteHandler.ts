import { useCallback } from 'react';

// Api
import { complete } from '@/api/responders';

// Constants
import { TYPES as MESSAGE_TYPES } from '@/constants/message';

export function useCompleteHandler() {
  const handler = useCallback(async (clientId: Client['id'], message: Message) => {
    const { quizId, data } = message as Messages.Complete;

    await complete({
      quizId,
      clientId,
    });
  }, []);

  return [MESSAGE_TYPES.complete, handler] as const;
}

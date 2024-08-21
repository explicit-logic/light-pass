import { toast } from '@/lib/toaster';
import { useCallback } from 'react';

// Api
import { identify } from '@/api/responders';

// Constants
import { TYPES as MESSAGE_TYPES } from '@/constants/message';

export function useIdentifyHandler() {
  const handler = useCallback(async (clientId: Client['id'], message: Message) => {
    try {
      const { quizId, data } = message as Messages.Identity;

      await identify({
        ...data,
        quizId,
        clientId,
      });
    } catch (error) {
      console.error(error);
      const message = (error as Error)?.message ?? error;
      toast.error(message);
    }
  }, []);

  return [MESSAGE_TYPES.identity, handler] as const;
}

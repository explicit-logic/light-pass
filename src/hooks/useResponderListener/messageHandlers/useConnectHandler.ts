import { useCallback } from 'react';

// Api
import { connect } from '@/api/responders';

// Helpers
import { platformToText } from '@/helpers/platformToText';
import { sendNotification } from '@/helpers/sendNotification';

// Constants
import { TYPES as MESSAGE_TYPES } from '@/constants/message';

export function useConnectHandler() {
  const handler = useCallback(async (clientId: Client['id'], message: Message) => {
    const { language, quizId, data } = message as Messages.Connect;
    const { platform, userAgent, timezone, theme } = data;

    await connect({
      quizId,
      clientId,
      language,
      platform,
      userAgent,
      timezone,
      theme,
    });
    sendNotification('New connection', platformToText(platform));
  }, []);

  return [MESSAGE_TYPES.connect, handler] as const;
}

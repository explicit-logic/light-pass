import { useCallback, useEffect } from 'react';

// Constants
import { CLIENT_EVENTS, STATES as CONNECTION_STATES } from '@/constants/connection';
import { TYPES as MESSAGE_TYPES } from '@/constants/message';

import { sendNotification } from '@/helpers/sendNotification';
// Lib
import { eventEmitter } from '@/lib/eventEmitter';

// Helpers
import { platformToText } from '@/helpers/platformToText';

// Hooks
import { useResponderStore } from '@/hooks/useResponderStore';

export function useClientListener({ quizId }: ConnectionOpenParams) {
  const addResponder = useResponderStore.use.addResponder();
  const complete = useResponderStore.use.complete();
  const doProgress = useResponderStore.use.doProgress();
  const identify = useResponderStore.use.identify();
  const setConnectionState = useResponderStore.use.setConnectionState();
  const respondersTree = useResponderStore.use.respondersTree();

  const onMessage = useCallback(
    (clientId: Client['id'], message: Message) => {
      if (message.type === MESSAGE_TYPES.connect) {
        const { locale, platform, timeZone, userAgent } = message.data as Messages.Connect['data'];
        addResponder({
          clientId,
          quizId,
          locale,
          platform,
          timeZone,
          state: CONNECTION_STATES.ONLINE,
          userAgent,
          connectedAt: new Date(),
        });

        if (!respondersTree[clientId]) {
          sendNotification('New connection', platformToText(platform));
        }

        return;
      }

      if (message.type === MESSAGE_TYPES.identity) {
        const { context, email, group, name } = message.data as Messages.Identity['data'];
        if (!email) return;
        identify({
          clientId,
          context,
          email: email.trim().toLowerCase(),
          group,
          name,
          startAt: new Date(),
        });
        return;
      }

      if (message.type === MESSAGE_TYPES.progress) {
        const { page } = message.data as Messages.Progress['data'];
        doProgress(clientId, page);
        return;
      }

      if (message.type === MESSAGE_TYPES.complete) {
        complete(clientId);
      }
    },
    [addResponder, complete, doProgress, identify, respondersTree, quizId],
  );

  const onError = useCallback(
    (clientId: ResponderInterface['clientId']) => {
      setConnectionState(clientId, CONNECTION_STATES.ERROR);
    },
    [setConnectionState],
  );

  const onClose = useCallback(
    (clientId: ResponderInterface['clientId']) => {
      setConnectionState(clientId, CONNECTION_STATES.OFFLINE);
    },
    [setConnectionState],
  );

  useEffect(() => {
    const handlers = {
      [CLIENT_EVENTS.MESSAGE]: onMessage,
      [CLIENT_EVENTS.CLOSE]: onClose,
      [CLIENT_EVENTS.ERROR]: onError,
    };

    for (const [eventName, handler] of Object.entries(handlers)) {
      eventEmitter.on(eventName, handler);
    }

    return () => {
      for (const [eventName, handler] of Object.entries(handlers)) {
        eventEmitter.off(eventName, handler);
      }
    };
  }, [onClose, onError, onMessage]);
}

import { useCallback, useEffect } from 'react';

// Constants
import { CLIENT_EVENTS, STATES as CONNECTION_STATES } from '@/constants/connection';
import { TYPES as MESSAGE_TYPES } from '@/constants/message';

// Helpers
import { platformToText } from '@/helpers/platformToText';
import { sendNotification } from '@/helpers/sendNotification';

// Hooks
import { useResponderStore } from '@/hooks/useResponderStore';

// Lib
import { eventEmitter } from '@/lib/eventEmitter';

// Models
import type { Responder } from '@/models/Responder';

export function useClientListener() {
  const addResponder = useResponderStore.use.addResponder();
  const complete = useResponderStore.use.complete();
  const doProgress = useResponderStore.use.doProgress();
  const identify = useResponderStore.use.identify();
  const setConnectionState = useResponderStore.use.setConnectionState();
  const respondersTree = useResponderStore.use.respondersTree();

  const onMessage = useCallback(
    (clientId: Client['id'], message: Message) => {
      if (message.type === MESSAGE_TYPES.connect) {
        const { language, platform, timezone, userAgent } = message.data as Messages.Connect['data'];
        addResponder({
          clientId,
          quizId: 0,
          language,
          platform,
          timezone,
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
    [addResponder, complete, doProgress, identify, respondersTree],
  );

  const onError = useCallback(
    (clientId: Responder['clientId']) => {
      setConnectionState(clientId, CONNECTION_STATES.ERROR);
    },
    [setConnectionState],
  );

  const onClose = useCallback(
    (clientId: Responder['clientId']) => {
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

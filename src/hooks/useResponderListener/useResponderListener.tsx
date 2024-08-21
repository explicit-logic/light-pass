import { useCallback, useEffect } from 'react';

// Constants
import { CLIENT_EVENTS, STATES as CONNECTION_STATES } from '@/constants/connection';
import { TYPES as MESSAGE_TYPES, type MessageType } from '@/constants/message';

// Lib
import { eventEmitter } from '@/lib/eventEmitter';

// Message handlers
import { useCompleteHandler } from './messageHandlers/useCompleteHandler';
import { useConnectHandler } from './messageHandlers/useConnectHandler';
import { useIdentifyHandler } from './messageHandlers/useIdentifyHandler';
import { useProgressHandler } from './messageHandlers/useProgressHandler';

import { toast } from '@/lib/toaster';

export function useResponderListener() {
  const completeHandler = useCompleteHandler();
  const connectHandler = useConnectHandler();
  const identifyHandler = useIdentifyHandler();
  const progressHandler = useProgressHandler();

  const messageHandlerMap = new Map<Message['type'], (clientId: Client['id'], message: Message) => Promise<void>>([
    completeHandler,
    connectHandler,
    identifyHandler,
    progressHandler,
  ]);

  const onMessage = useCallback(
    (clientId: Client['id'], message: Message) => {
      const { type } = message;
      const handler = messageHandlerMap.get(type);

      if (!handler) return;

      try {
        handler(clientId, message);
      } catch (error) {
        console.error(error);
        const message = (error as Error)?.message ?? error;
        toast.error(message);
      }
    },
    [messageHandlerMap],
  );

  useEffect(() => {
    const listeners = {
      [CLIENT_EVENTS.MESSAGE]: onMessage,
      // [CLIENT_EVENTS.CLOSE]: onClose,
      // [CLIENT_EVENTS.ERROR]: onError,
    };

    for (const [eventName, listener] of Object.entries(listeners)) {
      eventEmitter.on(eventName, listener);
    }

    return () => {
      for (const [eventName, listener] of Object.entries(listeners)) {
        eventEmitter.off(eventName, listener);
      }
    };
  }, [onMessage]);
}

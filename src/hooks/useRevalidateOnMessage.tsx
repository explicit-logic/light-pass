import { useCallback, useEffect } from 'react';
import { useRevalidator } from 'react-router-dom';

// Constants
import { CLIENT_EVENTS } from '@/constants/connection';

// Helpers
import { debounce } from '@/helpers/debounce';

// Lib
import { eventEmitter } from '@/lib/eventEmitter';

const eventName = CLIENT_EVENTS.MESSAGE;

export function useRevalidateOnMessage() {
  const revalidator = useRevalidator();
  // const onConnection = useCallback(() => {
  //   revalidator.revalidate();
  // }, [revalidator]);

  const onMessage = debounce(() => revalidator.revalidate());

  useEffect(() => {
    eventEmitter.on(eventName, onMessage);

    return () => {
      eventEmitter.off(eventName, onMessage);
    };
  }, [onMessage]);
}

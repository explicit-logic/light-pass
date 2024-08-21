import type React from 'react';
import { createContext, useCallback, useMemo, useState } from 'react';

// Constants
import { STATES, type StateType } from '@/constants/connection';

import { useResponderListener } from '@/hooks/useResponderListener';
// Hooks
import { useServerListener } from '@/hooks/useServerListener';

type ConnectionContextType = {
  activeCount: number;
  clientState: Record<string, StateType>;
  loading: boolean;
  online: boolean;
  state: StateType;
};

const initialValues: ConnectionContextType = Object.freeze({
  activeCount: 0,
  clientState: {},
  loading: false,
  online: false,
  state: STATES.OFFLINE,
});

export const ConnectionContext = createContext<ConnectionContextType>(initialValues);

export function ConnectionProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [clientState, setClientState] = useState<Record<string, StateType>>({});
  const [state, setState] = useState<StateType>(STATES.OFFLINE);

  const onLoading = useCallback(() => {
    setState(STATES.LOADING);
  }, []);

  const onOpen = useCallback(() => {
    setState(STATES.ONLINE);
  }, []);

  const onClose = useCallback(() => {
    setState(STATES.OFFLINE);
  }, []);

  const onConnection = useCallback((clientState: Record<string, StateType>) => {
    setClientState(clientState);
  }, []);

  const onError = useCallback(() => {
    setState(STATES.ERROR);
  }, []);

  useServerListener({ onClose, onConnection, onError, onLoading, onOpen });
  useResponderListener();

  const value = useMemo(
    () => ({
      activeCount: Object.values(clientState).filter((state) => state === STATES.ONLINE).length,
      clientState,
      loading: state === STATES.LOADING,
      online: state === STATES.ONLINE,
      state,
    }),
    [clientState, state],
  );

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
}

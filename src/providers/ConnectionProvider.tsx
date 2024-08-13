import type React from 'react';
import { createContext, useCallback, useMemo, useState } from 'react';

// Constants
import { STATES } from '@/constants/connection';

// Hooks
import { useClientListener } from '@/hooks/useClientListener';
import { useServerListener } from '@/hooks/useServerListener';

type ConnectionContextType = {
  loading: boolean;
  online: boolean;
  state: ConnectionStateType;
};

const initialValues: ConnectionContextType = Object.freeze({
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
  const [state, setState] = useState<ConnectionStateType>(STATES.OFFLINE);

  const onLoading = useCallback(() => {
    setState(STATES.LOADING);
  }, []);

  const onOpen = useCallback(() => {
    setState(STATES.ONLINE);
  }, []);

  const onClose = useCallback(() => {
    setState(STATES.OFFLINE);
  }, []);

  const onError = useCallback(() => {
    setState(STATES.ERROR);
  }, []);

  useServerListener({ onClose, onError, onLoading, onOpen });
  useClientListener();

  const value = useMemo(
    () => ({
      loading: state === STATES.LOADING,
      online: state === STATES.ONLINE,
      state,
    }),
    [state],
  );

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
}

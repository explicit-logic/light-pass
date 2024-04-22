'use client';

import type React from 'react';
import { createContext, useCallback, useMemo, useState } from 'react';

// Constants
import { STATES } from '@/constants/connection';

import { useClientListener } from '@/hooks/useClientListener';
// Hooks
import { useServerListener } from '@/hooks/useServerListener';

const DEFAULT_LOCALE = 'en';
const DEFAULT_QUIZ_ID = 0;

type ConnectionContextType = {
  locale: string;
  online: boolean;
  quizId: number;
  state: ConnectionStateType;
};

const initialValues: ConnectionContextType = Object.freeze({
  locale: DEFAULT_LOCALE,
  online: false,
  quizId: DEFAULT_QUIZ_ID,
  state: STATES.OFFLINE,
});

export const ConnectionContext = createContext<ConnectionContextType>(initialValues);

export function ConnectionProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [state, setState] = useState<ConnectionStateType>(STATES.OFFLINE);
  const [quizId, setQuizId] = useState<number>(DEFAULT_QUIZ_ID);
  const [locale, setLocale] = useState<string>(DEFAULT_LOCALE);
  const [initialized, setInitialized] = useState<boolean>(false);

  const onOpen = useCallback((params: ConnectionOpenParams) => {
    setQuizId(params.quizId);
    setLocale(params.locale);
    setState(STATES.ONLINE);
  }, []);

  const onClose = useCallback(() => {
    setQuizId(DEFAULT_QUIZ_ID);
    setLocale(DEFAULT_LOCALE);
    setState(STATES.OFFLINE);
  }, []);

  const onError = useCallback(() => {
    setState(STATES.ERROR);
  }, []);

  useServerListener({ onClose, onError, onOpen });
  useClientListener({ quizId, locale }, { setInitialized });

  const value = useMemo(
    () => ({
      initialized,
      locale,
      online: state === STATES.ONLINE,
      quizId,
      state,
    }),
    [initialized, locale, quizId, state],
  );

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
}

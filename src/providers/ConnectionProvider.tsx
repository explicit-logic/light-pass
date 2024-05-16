import type React from 'react';
import { createContext, useCallback, useMemo, useState } from 'react';

// Constants
import { STATES } from '@/constants/connection';
import { DEFAULT_LANGUAGE } from '@/constants/languages';

import { useClientListener } from '@/hooks/useClientListener';
// Hooks
import { useServerListener } from '@/hooks/useServerListener';

const DEFAULT_QUIZ_ID = 0;

type ConnectionContextType = {
  language: string;
  online: boolean;
  quizId: number;
  state: ConnectionStateType;
};

const initialValues: ConnectionContextType = Object.freeze({
  language: DEFAULT_LANGUAGE,
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
  const [language, setLanguage] = useState<string>(DEFAULT_LANGUAGE);

  const onOpen = useCallback((params: ConnectionOpenParams) => {
    setQuizId(params.quizId);
    setLanguage(params.language);
    setState(STATES.ONLINE);
  }, []);

  const onClose = useCallback(() => {
    setQuizId(DEFAULT_QUIZ_ID);
    setLanguage(DEFAULT_LANGUAGE);
    setState(STATES.OFFLINE);
  }, []);

  const onError = useCallback(() => {
    setState(STATES.ERROR);
  }, []);

  useServerListener({ onClose, onError, onOpen });
  useClientListener({ quizId, language });

  const value = useMemo(
    () => ({
      language,
      online: state === STATES.ONLINE,
      quizId,
      state,
    }),
    [language, quizId, state],
  );

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
}

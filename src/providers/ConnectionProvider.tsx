'use client';

import type React from 'react';
import { createContext, useState } from 'react';

// Constants
import { STATES } from '@/constants/connection';

const DEFAULT_LOCALE = 'en';
const DEFAULT_QUIZ_ID = 0;

type StateType = (typeof STATES)[keyof typeof STATES];

type TurnOnParams = { quizId: number; locale: string };

type ConnectionContextType = {
  locale: string;
  online: boolean;
  quizId: number;
  state: StateType;
  showError: () => void;
  turnOn: (params: TurnOnParams) => void;
  turnOff: () => void;
};

const initialValues: ConnectionContextType = Object.freeze({
  locale: DEFAULT_LOCALE,
  online: false,
  quizId: DEFAULT_QUIZ_ID,
  state: STATES.OFFLINE,
  showError: () => {},
  turnOn: () => {},
  turnOff: () => {},
});

export const ConnectionContext = createContext<ConnectionContextType>(initialValues);

export function ConnectionProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [state, setState] = useState<StateType>(STATES.OFFLINE);
  const [quizId, setQuizId] = useState<number>(DEFAULT_QUIZ_ID);
  const [locale, setLocale] = useState<string>(DEFAULT_LOCALE);
  const online = state === STATES.ONLINE;

  const turnOn = (params: TurnOnParams) => {
    setQuizId(params.quizId);
    setLocale(params.locale);
    setState(STATES.ONLINE);
  };

  const turnOff = () => {
    setQuizId(DEFAULT_QUIZ_ID);
    setLocale(DEFAULT_LOCALE);
    setState(STATES.OFFLINE);
  };

  const showError = () => {
    setState(STATES.ERROR);
  };

  return (
    <ConnectionContext.Provider
      value={{
        locale,
        online,
        quizId,
        state,
        showError,
        turnOn,
        turnOff,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

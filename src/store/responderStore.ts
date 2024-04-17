import { createStore } from 'zustand/vanilla';

export interface ResponderState {
  quizId: number;
  responders: Map<ResponderInterface['id'], ResponderInterface>;
  addResponder: (responder: ResponderInterface) => void;
  setQuizId: (quizId: number) => void;
  reset: () => void;
}

export const responderStore = createStore<ResponderState>((set) => ({
  quizId: 0,
  responders: new Map(),
  addResponder: (responder) =>
    set((prev) => ({
      responders: new Map(prev.responders).set(responder.id, responder),
    })),
  setQuizId: (quizId) => set({ quizId }),
  reset: () => {
    set({
      quizId: 0,
      responders: new Map(),
    });
  },
}));

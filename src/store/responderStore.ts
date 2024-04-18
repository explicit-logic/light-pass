import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';

export interface ResponderState {
  quizId: number;
  responders: Record<ResponderInterface['id'], ResponderInterface>;
  addResponder: (responder: ResponderInterface) => void;
  setIdentified: (id: ResponderInterface['id'], identified: ResponderInterface['identified']) => void;
  setQuizId: (quizId: number) => void;
  reset: () => void;
}

export const responderStore = createStore<ResponderState>()(
  immer((set) => ({
    quizId: 0,
    responders: {},
    addResponder: (responder) =>
      set((state) => {
        state.responders[responder.id] = responder;
      }),
    setIdentified: (id, identified) =>
      set((state) => {
        state.responders[id].identified = identified;
      }),
    setQuizId: (quizId) =>
      set((state) => {
        state.quizId = quizId;
      }),
    reset: () => {
      set({
        quizId: 0,
        responders: {},
      });
    },
  })),
);

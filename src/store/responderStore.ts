import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';

// Constants
import { STATES as CONNECTION_STATES } from '@/constants/connection';

type IdentityParam = {
  clientId: ResponderInterface['clientId'];
  context: ResponderInterface['context'];
  email: ResponderInterface['email'];
  startAt: ResponderInterface['startAt'];
} & Pick<ResponderInterface, 'name' | 'theme' | 'group'>;

export interface ResponderState {
  responders: Record<ResponderInterface['clientId'], ResponderInterface>;
  addResponder: (
    responder: Pick<ResponderInterface, 'clientId' | 'quizId' | 'locale' | 'platform' | 'timeZone' | 'state' | 'userAgent' | 'connectedAt'>,
  ) => void;
  complete: (clientId: ResponderInterface['clientId']) => void;
  doProgress: (clientId: ResponderInterface['clientId'], page: string) => void;
  identify: (patch: IdentityParam) => void;
  reset: () => void;
  setConnectionState: (clientId: ResponderInterface['clientId'], state: ConnectionStateType) => void;
}

export const responderStore = createStore<ResponderState>()(
  immer((set, get) => ({
    clientResponderMap: {},
    responders: {},
    addResponder: (responder) => {
      set((state) => {
        if (get().responders[responder.clientId]) {
          state.responders[responder.clientId].state = responder.state;
          return;
        }
        state.responders[responder.clientId] = {
          ...responder,
          id: 0,
          completed: false,
          identified: false,
          progress: 0,
          context: {
            slugs: [],
          },
        };
      });
    },

    complete: (clientId) => {
      set((state) => {
        state.responders[clientId].completed = true;
        state.responders[clientId].finishAt = new Date();
      });
    },

    doProgress: (clientId, page) => {
      const { responders } = get();
      const { slugs } = responders[clientId].context;
      const progress = slugs.findIndex((slug) => slug === page) + 1;
      set((state) => {
        state.responders[clientId].progress = progress;
        if (progress === slugs.length) {
          state.responders[clientId].completed = true;
          state.responders[clientId].finishAt = new Date();
        }
      });
    },

    identify: (patch) =>
      set((state) => {
        const { responders } = get();
        const { clientId } = patch;
        const respondersList = Object.values(responders);
        let id: ResponderInterface['id'] = 0;
        for (const responder of respondersList) {
          if (responder.email === patch.email) {
            id = responder.id;
            break;
          }
        }

        state.responders[id].email = patch.email;
        state.responders[id].identified = true;
        state.responders[id].context = patch.context;

        if (patch.name) {
          state.responders[id].name = patch.name;
        }
        if (patch.theme) {
          state.responders[id].theme = patch.theme;
        }
        if (patch.group) {
          state.responders[id].group = patch.group;
        }
        if (patch.startAt) {
          state.responders[id].startAt = patch.startAt;
        }
      }),
    reset: () => {
      set(
        {
          responders: {},
        },
        true,
      );
    },
    setConnectionState: (clientId, connectionState) => {
      set((state) => {
        const { responders } = get();
        const responder = responders[clientId];
        if (!responder) return;
        if (!responder.identified && (responder.state === CONNECTION_STATES.OFFLINE || responder.state === CONNECTION_STATES.ERROR)) {
          delete state.responders[clientId];
        } else {
          state.responders[clientId].state = connectionState;
        }
      });
    },
  })),
);

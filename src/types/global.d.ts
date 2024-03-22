import type { TYPES as MESSAGE_TYPES } from '../constants/message';

declare global {
  interface Client {
    id: string;

    agent: string;
    locale: string;
    theme: string;
  }

  type Message =
    | Messages.Complete
    | Messages.Connect
    | Messages.Identity
    | Messages.Init
    | Messages.Message
    | Messages.Page
    | Messages.Progress;

  namespace Messages {
    interface Complete {
      clientId: string;
      type: typeof MESSAGE_TYPES.progress;

      data: {
        result: object;
      };
    }

    interface Connect {
      type: typeof MESSAGE_TYPES.connect;

      data: {
        agent: string;
        clientId?: string;
        locale: string;
        pathname: string;
        theme: 'auto' | 'dark' | 'light';
        timeZone: string;
      };
    }

    interface Identity {
      clientId: string;
      type: typeof MESSAGE_TYPES.identity;

      data: {
        email: string;
        group?: string;
        name?: string;
        context: {
          slugs: string[];
        };
      };
    }

    interface Init {
      type: typeof MESSAGE_TYPES.init;

      data: {
        agent: string;
        clientId: string;
        locale: string;
        theme: 'auto' | 'dark' | 'light';
        timeZone: string;
      };
    }

    interface Message {
      clientId: string;
      type: typeof MESSAGE_TYPES.message;

      data: {
        text: string;
      };
    }

    interface Progress {
      clientId: string;
      type: typeof MESSAGE_TYPES.progress;

      data: {
        answer: object;
        page: string;
      };
    }
  }

  interface Responder {
    id: number;

    clientId: string;
    quizId: number;

    email: string;
    name?: string;
    group?: string;
    answer?: object;
  }
}

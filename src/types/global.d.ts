import type { TYPES as BLOCK_TYPES } from '@/constants/block';
import type { STATES as CONNECTION_STATES } from '@/constants/connection';
import type { TYPES as MESSAGE_TYPES } from '@/constants/message';

declare global {
  type ThemeModeType = 'auto' | 'dark' | 'light';

  type ConnectionStateType = (typeof CONNECTION_STATES)[keyof typeof CONNECTION_STATES];

  interface Client {
    id: string;

    userAgent: string;
    locale: string;
    theme: ThemeModeType;
  }

  type Message = Messages.Complete | Messages.Connect | Messages.Identity | Messages.Init | Messages.Message | Messages.Progress;

  type PlatformType = {
    browser: string;
    os: string;
    type: string;
    version: string;
  };

  namespace Messages {
    interface Complete {
      clientId: string;
      language: string;
      quizId: number;
      type: typeof MESSAGE_TYPES.complete;

      data: {
        result: object;
      };
    }

    interface Connect {
      language: string;
      quizId: number;
      type: typeof MESSAGE_TYPES.connect;

      data: {
        clientId?: string;
        pathname: string;
        platform: PlatformType;
        theme: ThemeModeType;
        timezone: string;
        userAgent: string;
      };
    }

    interface Identity {
      clientId: string;
      language: string;
      quizId: number;
      type: typeof MESSAGE_TYPES.identity;

      data: {
        email: string;
        group?: string;
        name: string;
        context: {
          slugs: string[];
        };
      };
    }

    interface Init {
      type: typeof MESSAGE_TYPES.init;

      data: {
        userAgent: string;
        clientId: string;
        language: string;
        platform: PlatformType;
        theme: ThemeModeType;
        timezone: string;
      };
    }

    interface Message {
      clientId: string;
      language: string;
      quizId: number;
      type: typeof MESSAGE_TYPES.message;

      data: {
        text: string;
      };
    }

    interface Progress {
      clientId: string;
      language: string;
      quizId: number;
      type: typeof MESSAGE_TYPES.progress;

      data: {
        answer: object;
        current: number;
        page: string;
        total: number;
      };
    }
  }

  interface ResponderInterface {
    id: number;
    clientId: string;
    quizId: number;

    completed: boolean;
    connectedAt: Date;

    identified: boolean;

    language: string;
    platform: PlatformType;
    progress: number;
    timezone: string;

    state: ConnectionStateType; // virtual

    userAgent: string;

    email?: string;
    name?: string;
    theme?: ThemeModeType;
    group?: string;

    startAt?: Date;
    finishAt?: Date;

    context: {
      slugs: string[];
    };
  }

  type Block = Blocks.Header | Blocks.Input | Blocks.CheckboxGroup | Blocks.Image | Blocks.RadioGroup;
  type InteractionBlock = Blocks.CheckboxGroup | Blocks.RadioGroup;

  type BlocksList = Block[];

  namespace Blocks {
    interface CheckboxGroup {
      type: typeof BLOCK_TYPES.CHECKBOX_GROUP;
      label: string;
      name: string;
      values: Option[];
    }

    interface Header {
      type: typeof BLOCK_TYPES.HEADER;
      subtype: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      label: string;
    }

    interface Image {
      type: typeof BLOCK_TYPES.IMAGE;
      src: string;
      label: string;
      mimetype: string;
      size: string;
    }

    interface Input {
      type: typeof BLOCK_TYPES.INPUT;
      label: string;
      value: string;
    }

    interface Option {
      label: string;
      value: string;
      selected: boolean;
    }
    interface RadioGroup {
      type: typeof BLOCK_TYPES.RADIO_GROUP;
      label: string;
      name: string;
      values: Option[];
    }
  }

  interface PageConfig {
    formData: BlocksList;
  }
}

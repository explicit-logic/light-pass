import Peer, { type DataConnection } from 'peerjs';

// Constants
import { TYPES } from '../../constants/message';

// Store
import {
  attachConnection,
  clearConnectionMap,
  deleteConnection,
  // detachConnection,
  getClientIdByConnection,
  getConnectionByClientId,
  getSender,
  hasConnection,
  setConnection,
  setSender,
} from './store';

const TIMEOUT = 60_000;

type Params = { locale: string };

type Callbacks = {
  onMessage?: (clientId: Client['id'], message: Message) => void;
  onClose?: (clientId: Client['id']) => void;
  onError?: (clientId: Client['id'], error: Error) => void;
};

export async function connect({ locale }: Params, callbacks?: Callbacks) {
  const cachedSender = getSender();
  if (cachedSender) return cachedSender;

  const peer = new Peer();
  setSender(peer);

  const close = () => {
    resetAll();
  };
  const errorHandler = (error: Error) => {
    resetAll();
    console.error(error);
  };
  peer
    .on('close', close)
    .on('disconnected', close)
    .on('error', errorHandler)

    .on('connection', (connection) => establishConnection({ connection, locale, sender: peer }, callbacks));

  const senderId = await promiseWithTimeout<string>(TIMEOUT, (resolve) => peer.on('open', (id) => resolve(id)));

  console.log('Sender ID: ', senderId);

  return peer;
}

function resetAll() {
  clearConnectionMap();
  setSender(undefined);
}

async function establishConnection(params: { connection: DataConnection; locale: string; sender: Peer }, callbacks?: Callbacks) {
  const { onMessage = () => {}, onClose = () => {}, onError = () => {} } = callbacks ?? {};
  const { locale, connection } = params;
  setConnection(connection);

  const reset = () => {
    // detachConnection(connection);
    deleteConnection(connection.peer);
  };

  connection
    .on('close', () => {
      const clientId = getClientIdByConnection(connection);
      reset();
      if (clientId) {
        onClose(clientId);
      }
    })
    .on('error', (error) => {
      const clientId = getClientIdByConnection(connection);
      reset();
      if (clientId) {
        onError(clientId, error);
      }
    })
    .on('data', async (body) => {
      const message = body as Message;

      console.log('message', body);

      if (message.type === TYPES.connect) {
        const { data } = message;
        const clientId = ensureClientId(connection, message);

        if (data.clientId) {
          const prevConnection = getConnectionByClientId(data.clientId);
          if (prevConnection && prevConnection.peer !== connection.peer) {
            // prevConnection.close();
            deleteConnection(prevConnection.peer);
          }
        }

        attachConnection(clientId, connection.peer);

        await connection.send(getInit({ clientId, locale }) as Messages.Init);

        onMessage(clientId, message);

        return;
      }

      if (!('clientId' in message)) {
        return;
      }
      const connectionClientId = getClientIdByConnection(connection);
      if (!connectionClientId || connectionClientId !== message.clientId) {
        return;
      }

      onMessage(connectionClientId, message);
    });
}

function ensureClientId(connection: DataConnection, message: Messages.Connect): string {
  const { data } = message;
  if (data.clientId && hasConnection(data.clientId)) {
    return data.clientId;
  }

  return connection.peer;
}

/*
  Exception listeners

  Sender: close, disconnected, error

  Receiver: close, error
*/

export function getInit({ clientId, locale }: { clientId: Client['id']; locale: string }): Messages.Init {
  return {
    type: TYPES.init,
    data: {
      agent: navigator.userAgent,
      clientId,
      locale,
      theme: 'dark',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };
}

function promiseWithTimeout<T = void>(
  timeout: number,
  callback: (resolve: (value: T) => void, reject: (reason?: unknown) => void) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Promise timed out after ${timeout} ms`));
    }, timeout);

    callback(
      (value: T) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

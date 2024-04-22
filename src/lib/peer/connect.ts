import Peer, { type DataConnection } from 'peerjs';

// Helpers
import { detectPlatform } from '@/helpers/detectPlatform';
import { getLocaleLang } from '@/helpers/getLocaleLang';

// Constants
import { CLIENT_EVENTS, SERVER_EVENTS } from '@/constants/connection';
import { TYPES } from '@/constants/message';

// Lib
import { eventEmitter } from '@/lib/eventEmitter';

// Store
import {
  attachConnection,
  clearConnectionMap,
  deleteConnection,
  // detachConnection,
  getClientIdByConnection,
  getConnectionByClientId,
  getServer,
  hasConnection,
  setConnection,
  setServer,
} from './store';

const TIMEOUT = 60_000;

export async function connect(context: ConnectionOpenParams) {
  const cachedServer = getServer();
  if (cachedServer) return cachedServer;

  const peer = new Peer();
  setServer(peer);

  const close = () => {
    resetAll();
    eventEmitter.emit(SERVER_EVENTS.CLOSE, context);
  };
  const errorHandler = (error: Error) => {
    resetAll();
    eventEmitter.emit(SERVER_EVENTS.ERROR, context, error);
    console.error(error);
  };
  peer
    .on('close', close)
    .on('disconnected', close)
    .on('error', errorHandler)

    .on('connection', (connection) => establishConnection({ connection, server: peer }));

  const serverId = await promiseWithTimeout<string>(TIMEOUT, (resolve) => peer.on('open', (id) => resolve(id)));

  eventEmitter.emit(SERVER_EVENTS.OPEN, context);

  console.log('Server ID: ', serverId);

  return peer;
}

function resetAll() {
  clearConnectionMap();
  setServer(undefined);
}

async function establishConnection(params: { connection: DataConnection; server: Peer }) {
  const { connection } = params;
  const locale = await getLocaleLang();

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
        eventEmitter.emit(CLIENT_EVENTS.CLOSE, clientId);
      }
    })
    .on('error', (error) => {
      const clientId = getClientIdByConnection(connection);
      reset();
      if (clientId) {
        eventEmitter.emit(CLIENT_EVENTS.ERROR, clientId, error);
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

        eventEmitter.emit(CLIENT_EVENTS.MESSAGE, clientId, message);

        return;
      }

      if (!('clientId' in message)) {
        return;
      }
      const connectionClientId = getClientIdByConnection(connection);
      if (!connectionClientId || connectionClientId !== message.clientId) {
        return;
      }

      eventEmitter.emit(CLIENT_EVENTS.MESSAGE, connectionClientId, message);
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

  Server: close, disconnected, error

  Client: close, error
*/

export function getInit({ clientId, locale }: { clientId: Client['id']; locale: string }): Messages.Init {
  return {
    type: TYPES.init,
    data: {
      userAgent: navigator.userAgent,
      clientId,
      locale,
      platform: detectPlatform(),
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

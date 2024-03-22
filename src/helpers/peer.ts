import Peer, { type DataConnection } from 'peerjs';

let peer: Peer | undefined;
const connectionMap: Map<string, DataConnection> = new Map<string, DataConnection>();

export interface Data {
  type: string;
  message: string;
}

export const PeerConnection = {
  getPeer: () => peer,
  startPeerSession: () =>
    new Promise<string>((resolve, reject) => {
      if (peer?.id) {
        return resolve(peer.id);
      }
      try {
        peer = new Peer();
        peer
          .on('open', (id) => {
            console.log(`My ID: ${id}`);
            resolve(id);
          })
          .on('error', (err) => {
            console.log(err);
            reject(err);
          });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    }),
  closePeerSession: () =>
    new Promise<void>((resolve, reject) => {
      try {
        if (peer) {
          peer.destroy();
          peer = undefined;
        }
        resolve();
      } catch (err) {
        console.log(err);
        reject(err);
      }
    }),
  onIncomingConnection: (callback: (conn: DataConnection) => void) => {
    peer?.on('connection', (conn) => {
      console.log(`Incoming connection: ${conn.peer}`);
      connectionMap.set(conn.peer, conn);
      callback(conn);
    });
  },
  onConnectionDisconnected: (id: string, callback: () => void) => {
    if (!peer) {
      throw new Error("Peer doesn't start yet");
    }
    if (!connectionMap.has(id)) {
      throw new Error("Connection didn't exist");
    }
    const conn = connectionMap.get(id);
    if (conn) {
      conn.on('close', () => {
        console.log(`Connection closed: ${id}`);
        connectionMap.delete(id);
        callback();
      });
    }
  },
  sendConnection: (id: string, data: Data): Promise<void> =>
    new Promise((resolve, reject) => {
      if (!connectionMap.has(id)) {
        reject(new Error("Connection didn't exist"));
      }
      try {
        const conn = connectionMap.get(id);
        if (conn) {
          void conn.send(data);
        }
      } catch (err) {
        reject(err);
      }
      resolve();
    }),
  sendBroadcast: async (data: Message) => {
    if (!connectionMap.size) {
      console.warn('No connections!');
      return;
    }
    for (const conn of connectionMap.values()) {
      await conn.send(data);
      console.info('Sent to: ', conn.peer);
    }
  },
  onConnectionReceiveData: (id: string, callback: (f: Data) => void) => {
    if (!peer) {
      throw new Error("Peer doesn't start yet");
    }
    if (!connectionMap.has(id)) {
      throw new Error("Connection didn't exist");
    }
    const conn = connectionMap.get(id);
    if (conn) {
      conn.on('data', (receivedData) => {
        console.log(`Receiving data from ${id}`);
        console.log(receivedData);
        const data = receivedData as Data;
        callback(data);
      });
    }
  },
};

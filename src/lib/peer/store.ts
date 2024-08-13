import type { DataConnection, Peer } from 'peerjs';

const connectionMap = new Map<DataConnection['peer'], DataConnection>();
const clientConnectionMap = new Map<Client['id'], DataConnection['peer']>();

let _server: Peer | undefined;

export function attachConnection(clientId: Client['id'], connectionId: DataConnection['peer']) {
  clientConnectionMap.set(clientId, connectionId);
}

export function clearConnectionMap() {
  connectionMap.clear();
}

export function deleteConnection(connectionId: DataConnection['peer']) {
  connectionMap.delete(connectionId);
}

export function detachConnection(connection: DataConnection) {
  for (const [clientId, connectionId] of clientConnectionMap.entries()) {
    if (connectionId === connection.peer) {
      clientConnectionMap.delete(clientId);
      return;
    }
  }
}

export function getConnections() {
  return connectionMap.values();
}

export function getConnectionByClientId(clientId: Client['id']) {
  const connectionId = clientConnectionMap.get(clientId);

  if (connectionId) {
    return connectionMap.get(connectionId);
  }
}

export function getClientIdByConnection(connection: DataConnection) {
  for (const [clientId, connectionId] of clientConnectionMap.entries()) {
    if (connectionId === connection.peer) {
      return clientId;
    }
  }
}

export function getServer() {
  return _server;
}

export function hasConnection(clientId: Client['id']) {
  return clientConnectionMap.has(clientId);
}

export function setConnection(connection: DataConnection) {
  connectionMap.set(connection.peer, connection);
}

export function setServer(server: Peer | undefined) {
  _server = server;
}

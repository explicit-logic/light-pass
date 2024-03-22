import type { TYPES } from '../../constants/message';

// Store
import { getConnectionByClientId, getSender } from './store';

export async function sendToOne(clientId: Client['id'], type: (typeof TYPES)[keyof typeof TYPES], data: Message['data']) {
  const sender = getSender();

  if (!sender) {
    console.error('Sender is not set');
    return;
  }

  const connection = getConnectionByClientId(clientId);

  if (!connection) {
    console.error(`Client [${clientId}] has no connection`);
    return;
  }

  await connection.send({
    clientId: sender.id,
    type,
    data,
  });
}

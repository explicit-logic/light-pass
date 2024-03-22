import type { TYPES } from '../../constants/message';

// Store
import { getConnections, getSender } from './store';

export async function sendToAll(type: (typeof TYPES)[keyof typeof TYPES], data: Message['data']) {
  const sender = getSender();

  if (!sender) {
    console.error('Sender is not set');
    return;
  }

  for (const connection of getConnections()) {
    await connection.send({
      clientId: sender.id,
      type,
      data,
    });
  }
}

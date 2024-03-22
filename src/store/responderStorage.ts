const responderMap = new Map<Client['id'], Responder>();

export function getResponder(clientId: Client['id']): Responder | undefined {
  return responderMap.get(clientId);
}

export function setResponder(clientId: Client['id'], responder: Responder) {
  responderMap.set(clientId, responder);
}

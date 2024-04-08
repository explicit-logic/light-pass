// Modules
import { useContext } from 'react';

// Context
import { ConnectionContext } from '@/providers/ConnectionProvider';

export function useConnection() {
  const connectionContext = useContext(ConnectionContext);

  return connectionContext;
}

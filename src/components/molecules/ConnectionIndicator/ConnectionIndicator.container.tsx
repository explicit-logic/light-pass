// Components
import ConnectionIndicatorView from './ConnectionIndicator.view';

// Hooks
import { useConnection } from '@/hooks/useConnection';

function ConnectionIndicatorContainer() {
  const connection = useConnection();

  return <ConnectionIndicatorView online={connection.online} />;
}

export default ConnectionIndicatorContainer;

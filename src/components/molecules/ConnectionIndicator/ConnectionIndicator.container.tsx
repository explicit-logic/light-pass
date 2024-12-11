// Components
import ConnectionIndicatorView from './ConnectionIndicator.view';

// Hooks
import { useConnection } from '@/hooks/useConnection';

function ConnectionIndicatorContainer() {
  const connection = useConnection();

  return <ConnectionIndicatorView activeCount={connection.activeCount} online={connection.online} state={connection.state} />;
}

export default ConnectionIndicatorContainer;

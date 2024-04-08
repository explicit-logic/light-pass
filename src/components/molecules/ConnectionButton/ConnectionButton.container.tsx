import { useConnection } from '@/hooks/useConnection';

// Components
import ConnectionButtonView from './ConnectionButton.view';

// Constants
import { STATES } from '@/constants/connection';

function ConnectionButtonContainer() {
  const { state } = useConnection();
  const online = state === STATES.ONLINE;

  return <ConnectionButtonView online={online} />;
}

export default ConnectionButtonContainer;

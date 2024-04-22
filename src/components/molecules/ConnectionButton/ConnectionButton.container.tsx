import { useConnection } from '@/hooks/useConnection';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import ConnectionButtonView from './ConnectionButton.view';

// Store
import { getServer } from '@/lib/peer/store';

function ConnectionButtonContainer() {
  const { online } = useConnection();
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    // Disconnect
    if (online) {
      const peer = getServer();
      if (peer) {
        peer.disconnect();
        peer.destroy();
      }
    } else {
      // Connect
      navigate(0);
    }
  }, [online, navigate]);

  return <ConnectionButtonView onClick={onClick} online={online} />;
}

export default ConnectionButtonContainer;

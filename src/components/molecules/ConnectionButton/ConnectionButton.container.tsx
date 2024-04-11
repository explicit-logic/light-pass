import { useConnection } from '@/hooks/useConnection';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import ConnectionButtonView from './ConnectionButton.view';

// Store
import { getSender } from '@/lib/peer/store';

function ConnectionButtonContainer() {
  const { online, turnOff } = useConnection();
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    if (online) {
      const peer = getSender();
      if (peer) {
        peer.disconnect();
        peer.destroy();
      }

      turnOff();
    } else {
      navigate(0);
    }
  }, [online, navigate, turnOff]);

  return <ConnectionButtonView onClick={onClick} online={online} />;
}

export default ConnectionButtonContainer;

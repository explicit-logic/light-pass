// Modules
import { QRCodeSVG } from 'qrcode.react';

// import { appWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';

// Constants
import { TYPES } from '../../constants/message';

// Helpers
import { getLocaleLang } from '../../helpers/getLocaleLang';

// Lib
import { connect } from '../../lib/peer/connect';
import { sendToAll } from '../../lib/peer/sendToAll';

// Store
import { getSender } from '../../lib/peer/store';

const url = 'https://explicit-logic.github.io/quiz-web-3/en';

function Connect() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [receiverId, setReceiverId] = useState<string>();
  const connectionUrl = `${url}?r=${receiverId}`;

  useEffect(() => {
    const establishConnection = async () => {
      setLoading(true);

      const locale = await getLocaleLang();

      const peer = await connect(
        { locale },
        {
          onMessage: (clientId, message) => {
            console.info('Message', clientId, message);
          },
          onClose: (clientId) => {
            console.info('Student disconnected:', clientId);
          },
          onError: (clientId, error) => {
            console.error(clientId, error);
          },
        },
      );
      setReceiverId(peer.id);
      setLoading(false);
    };
    establishConnection();

    return () => {
      const peer = getSender();
      if (peer) {
        peer.disconnect();
        peer.destroy();
      }
    };
  }, []);

  const sendBroadcast = async () => {
    if (!receiverId) {
      return;
    }

    await sendToAll(TYPES.message, { text: message });
  };

  if (loading) {
    return (
      <div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: '20px',
        }}
      >
        <QRCodeSVG size={350} value={connectionUrl} />
      </div>
      <input disabled placeholder='' value={connectionUrl} />
      <input onChange={(e) => setMessage(e.currentTarget.value)} placeholder='' />
      <button type='button' onClick={sendBroadcast}>
        Broadcast
      </button>
    </div>
  );
}

export default Connect;

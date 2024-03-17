// Modules
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Helpers
import { PeerConnection } from '../../helpers/peer';

const url = 'https://explicit-logic.github.io/quiz-web-3/en';

function Connect() {
  const [loading, setLoading] = useState(false);
  const [receiverId, setReceiverId] = useState<string>();
  const connectionUrl = `${url}?r=${receiverId}`;

  useEffect(() => {
    const connect = async () => {
      setLoading(true);
      const id = await PeerConnection.startPeerSession();
      PeerConnection.onIncomingConnection((sender) => {
        const senderId = sender.peer;
        console.info("Student connected:", senderId);

        void PeerConnection.sendConnection(senderId, {
          type: 'welcome',
          message: 'Teacher A',
        });

        PeerConnection.onConnectionDisconnected(senderId, () => {
          console.info("Student disconnected:", senderId);
        });
        PeerConnection.onConnectionReceiveData(senderId, (data) => {
          console.info("Data from student ", data, senderId);
        });
      });

      setReceiverId(id);
      setLoading(false);
    };
    connect();
  }, []);

  const sendBroadcast = async () => {
    await PeerConnection.sendBroadcast({
      type: 'broadcast',
      message: 'Hi from teacher: ' + new Date().getTime(),
    });
  }

  if (loading) {
    return (
      <div>
        <div>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        marginBottom: '20px',
      }}>
        <QRCodeSVG
          size={350}
          value={connectionUrl}
        />
      </div>
      <input
        disabled
        placeholder=""
        value={connectionUrl}
      />
      <button type="button" onClick={sendBroadcast}>Broadcast</button>
    </div>
  );
}

export default Connect;

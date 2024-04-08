// Modules
import { QRCodeSVG } from 'qrcode.react';
import { useParams } from 'react-router-dom';

// import { appWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';

// Constants
import { TYPES } from '@/constants/message';

import RespondersButton from '@/components/atoms/RespondersButton';
// Components
import ClipBoardField from '@/components/molecules/ClipboardField';
import ConnectionButton from '@/components/molecules/ConnectionButton';

// Helpers
import { getLocaleLang } from '@/helpers/getLocaleLang';

// Hooks
import { useConnection } from '@/hooks/useConnection';

// Lib
import { connect } from '@/lib/peer/connect';
import { sendToAll } from '@/lib/peer/sendToAll';

// Store
import { getSender } from '@/lib/peer/store';

const url = 'https://explicit-logic.github.io/quiz-web-3/en';

function Connect() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [receiverId, setReceiverId] = useState<string>();
  const { locale, quizId } = useParams();
  const connection = useConnection();
  const connectionUrl = `${url}?r=${receiverId}`;

  useEffect(() => {
    if (!locale || !quizId) return;

    // connection.turnOn({
    //   locale,
    //   quizId: Number(quizId),
    // });

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
    // establishConnection();

    return () => {
      const peer = getSender();
      if (peer) {
        peer.disconnect();
        peer.destroy();
      }
    };
  }, [locale, quizId]);

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
    <div className="flex flex-col items-center justify-center pt-6">
      <div className="p-3 bg-white rounded-md mb-6">
        <QRCodeSVG size={450} value={connectionUrl} />
      </div>
      <div className="mb-6 w-full">
        <ClipBoardField value={connectionUrl} />
      </div>
      <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <ConnectionButton />
        <RespondersButton />
      </div>
      {/* <input onChange={(e) => setMessage(e.currentTarget.value)} placeholder="" />
      <button
        className="bg-blue-700 dark:bg-blue-600 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-700 focus:ring-blue-300 dark:focus:ring-blue-800 inline-flex justify-center items-center py-3.5 px-5 text-white font-medium rounded-lg text-sm me-2 mb-2 focus:ring-4 focus:outline-none disabled:cursor-not-allowed"
        type="button"
        onClick={sendBroadcast}
      >
        Broadcast
      </button> */}
    </div>
  );
}

export default Connect;

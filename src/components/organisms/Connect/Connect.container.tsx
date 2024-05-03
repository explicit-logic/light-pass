import type { Locale } from '@/api/locales';
// Modules
import type Peer from 'peerjs';

import { QRCodeSVG } from 'qrcode.react';
import { useEffect } from 'react';
import { useAsyncValue, useLoaderData, useNavigate, useParams } from 'react-router-dom';

// Components
import QrIcon from '@/components/atoms/QrIcon';
import RespondersButton from '@/components/atoms/RespondersButton';
import ClipBoardField from '@/components/molecules/ClipboardField';
import ConnectionButton from '@/components/molecules/ConnectionButton';

// Constants
import { CLIENT_EVENTS } from '@/constants/connection';
import { TYPES as MESSAGE_TYPES } from '@/constants/message';

// Hooks
import { useConnection } from '@/hooks/useConnection';
import { useResponderStore } from '@/hooks/useResponderStore';

// Lib
import { eventEmitter } from '@/lib/eventEmitter';

function ConnectContainer() {
  const { language, quizId } = useParams();
  const { online } = useConnection();
  const { locale } = useLoaderData() as { locale: Locale };
  const peer = useAsyncValue() as Peer;
  const navigate = useNavigate();
  const responders = useResponderStore.use.responders();
  const respondersCount = responders.length;
  const peerId = peer.id;
  const connectionUrl = `${locale.url}?r=${peerId}`;

  useEffect(() => {
    const onMessage = (_clientId: Client['id'], message: Message) => {
      if (respondersCount <= 1 && message.type === MESSAGE_TYPES.connect) {
        navigate(`/quizzes/${quizId}/locales/${language}/responders`);
      }
    };

    eventEmitter.on(CLIENT_EVENTS.MESSAGE, onMessage);

    return () => {
      eventEmitter.off(CLIENT_EVENTS.MESSAGE, onMessage);
    };
  }, [language, respondersCount, quizId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center pt-6">
      <div className="mb-6">
        {online ? (
          <div className="p-3 bg-white rounded-md">
            <QRCodeSVG size={450} value={connectionUrl} />
          </div>
        ) : (
          <div className="flex items-center rounded-md justify-center h-[474px] w-[474px] bg-gray-300 dark:bg-gray-700">
            <QrIcon className="w-80 h-80 dark:text-gray-600" />
          </div>
        )}
      </div>
      <div className="mb-6 w-full">
        {online ? <ClipBoardField value={connectionUrl} /> : <div className="h-[42px] w-full bg-gray-200 rounded-md dark:bg-gray-700" />}
      </div>
      <div className="flex flex-row justify-center space-y-0 space-x-4 w-full">
        <ConnectionButton />
        <RespondersButton />
      </div>
    </div>
  );
}

export default ConnectContainer;

// Modules
import type Peer from 'peerjs';
import { QRCodeSVG } from 'qrcode.react';
import { useAsyncValue, useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';

import QrIcon from '@/components/atoms/QrIcon';
import RespondersButton from '@/components/atoms/RespondersButton';
// Components
import ClipBoardField from '@/components/molecules/ClipboardField';
import ConnectionButton from '@/components/molecules/ConnectionButton';

// Hooks
import { useConnection } from '@/hooks/useConnection';

const url = 'https://explicit-logic.github.io/quiz-web-3/en';

function ConnectContainer() {
  const { locale, quizId } = useParams();
  const { online, turnOn } = useConnection();
  const peer = useAsyncValue() as Peer;
  const peerId = peer.id;
  const connectionUrl = `${url}?r=${peerId}`;

  useEffect(() => {
    if (!locale || !quizId || !peerId) return;

    turnOn({
      locale,
      quizId: Number(quizId),
    });
  }, [locale, peerId, quizId, turnOn]);

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

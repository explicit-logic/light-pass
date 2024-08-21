import { memo, useCallback, useMemo, useState } from 'react';
import { type LoaderFunction, useLoaderData, useParams, useRevalidator } from 'react-router-dom';

// Api
import { remove as removeResponder } from '@/api/responders';

// Components
import ResponderTableView from './ResponderTable.view';

// Lib
import { toast } from '@/lib/toaster';

// Models
import type { Responder } from '@/models/Responder';

// Hooks
// import { useResponderStore } from '@/hooks/useResponderStore';
import { useConnection } from '@/hooks/useConnection';
import { useRevalidateOnMessage } from '@/hooks/useRevalidateOnMessage';

function ResponderTableContainer() {
  const { responders } = useLoaderData() as { responders: Responder[] };
  // const responders = useResponderStore.use.responders();
  const { clientState } = useConnection();

  const [responderToRemove, setResponderToRemove] = useState<Responder>();
  const revalidator = useRevalidator();

  useRevalidateOnMessage();

  const openRemoveModal = useCallback((responder: Responder) => setResponderToRemove(responder), []);

  const closeRemoveModal = useCallback(() => {
    setResponderToRemove(undefined);
  }, []);

  const onRemove = useCallback(() => {
    if (!responderToRemove) return;
    try {
      const name = responderToRemove.name || responderToRemove.email || 'Unknown';
      removeResponder(responderToRemove);
      revalidator.revalidate();
      closeRemoveModal();
      toast(`${name} removed`);
    } catch (error) {
      const message = (error as Error)?.message ?? error;
      toast.error(message);
    }
  }, [closeRemoveModal, responderToRemove, revalidator]);

  return (
    <ResponderTableView
      clientState={clientState}
      closeRemoveModal={closeRemoveModal}
      onRemove={onRemove}
      openRemoveModal={openRemoveModal}
      responders={responders}
      responderToRemove={responderToRemove}
    />
  );
}

export default ResponderTableContainer;

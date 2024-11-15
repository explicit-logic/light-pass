import type { Responder } from '@/models/Responder';
import type { FinalMarkForm } from '../types/FinalMarkForm.types';

import { memo, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useLoaderData, useRevalidator } from 'react-router-dom';

// Components
import { Button } from '@headlessui/react';

import { run } from '@/lib/evaluation/run';

// Lib
import { toast } from '@/lib/toaster';
import ConfirmModal from './ConfirmModal';

function RefreshButton() {
  const { responder } = useLoaderData() as { responder: Responder };
  const revalidator = useRevalidator();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const methods = useFormContext<FinalMarkForm>();
  const { resetField } = methods;

  const disabled = responder.verified;
  const openConfirmModal = useCallback(() => setConfirmModalOpen(true), []);

  const closeConfirmModal = useCallback(() => setConfirmModalOpen(false), []);

  const refresh = useCallback(async () => {
    try {
      const autoMark = await run(responder.id);
      revalidator.revalidate();
      resetField('finalMark', { defaultValue: autoMark });

      toast.success('Auto evaluation completed');

      closeConfirmModal();
    } catch (error) {
      const message = (error as Error)?.message ?? error;
      toast.error(message);
      console.log(error);
    }
  }, [closeConfirmModal, responder.id, revalidator, resetField]);

  return (
    <>
      <Button
        type="button"
        className="h-12 text-gray-900 bg-white border border-gray-300 focus:outline-none data-[hover]:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:data-[hover]:bg-gray-700 dark:data-[hover]:border-gray-600 dark:focus:ring-gray-700"
        disabled={disabled}
        onClick={openConfirmModal}
      >
        <svg
          className="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
          />
        </svg>
      </Button>
      <ConfirmModal isOpen={confirmModalOpen} close={closeConfirmModal} onConfirm={refresh} />
    </>
  );
}

export default memo(RefreshButton);

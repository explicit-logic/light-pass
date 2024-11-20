import type { Responder } from '@/models/Responder';
import { memo, useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';

// Components
import { Button } from '@headlessui/react';

// Lib
import { download } from '@/lib/pdf-make/download';
import { toast } from '@/lib/toaster';

// Utils
import { buildPdf } from '../utils/buildPdf';

function DownloadPdfButton() {
  const { responder } = useLoaderData() as { responder: Responder };
  const onClick = useCallback(() => {
    const handler = async () => {
      const documentDefinition = await buildPdf(responder.id);
      await download(documentDefinition);
    };
    toast.promise(handler(), {
      loading: 'Processing...',
      success: 'PDF file has been created',
      error: (err) => err.toString(),
    });
  }, [responder.id]);

  return (
    <Button
      type="button"
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg data-[hover]:bg-gray-100 data-[hover]:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:data-[hover]:text-white dark:data-[hover]:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      disabled={false}
      onClick={onClick}
    >
      <svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
        <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
      </svg>
      Download PDF
    </Button>
  );
}

export default memo(DownloadPdfButton);

import { create } from '@/api/messages';
import { memo, useCallback } from 'react';
import { useRevalidator } from 'react-router-dom';

import type { Locale } from '@/models/Locale';
import type { Quiz } from '@/models/Quiz';

function CreateButton(props: { quiz: Quiz; language: Locale['language'] }) {
  const { quiz, language } = props;

  const revalidator = useRevalidator();

  const onClick = useCallback(async () => {
    await create(quiz, language);

    revalidator.revalidate();
  }, [quiz, language, revalidator]);

  return (
    <button
      type="button"
      className="text-center inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
      onClick={onClick}
    >
      Generate
    </button>
  );
}

export default memo(CreateButton);

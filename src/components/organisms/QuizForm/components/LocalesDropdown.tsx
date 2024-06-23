import type { Locale } from '@/models/Locale';
import type { FieldArrayWithId, UseFieldArrayUpdate } from 'react-hook-form';
import type { EditFormData } from '../QuizForm.types';

import { DEFAULT_LANGUAGE, languages } from '@/constants/languages';
import { memo, useCallback, useState } from 'react';

const getLanguageById = (_id?: keyof typeof languages) => {
  const id = _id || DEFAULT_LANGUAGE;

  return { id, name: languages[id] };
};

function LocalesDropdown({
  field,
  idx,
  languagesArray,
  update,
}: {
  field: FieldArrayWithId<{ language: keyof typeof languages }>;
  idx: number;
  languagesArray: { id: keyof typeof languages; name: string }[];
  update: UseFieldArrayUpdate<
    {
      locales: {
        language: Locale['language'];
        main: Locale['main'];
        url: Locale['url'];
      }[];
    },
    'locales'
  >;
}) {
  const language = getLanguageById(field.id as keyof typeof languages);

  const [isOpen, setIsOpen] = useState(false);
  const onClick = useCallback(() => {
    const close = () => {
      setIsOpen(false);
      document.removeEventListener('click', close);
    };

    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => {
        document.addEventListener('click', close);
      }, 100);
    }
  }, [isOpen]);

  const select = useCallback(
    (id: keyof typeof languages) => {
      return (e: React.SyntheticEvent) => {
        e.preventDefault();
        update(idx, { language: id, main: false, url: '' });
      };
    },
    [idx, update],
  );

  return (
    <>
      <button
        className="flex-shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
        type="button"
        onClick={onClick}
      >
        {language?.name}
        <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {languagesArray.map(({ id, name }) => (
              <li key={id}>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={select(id)}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default memo(LocalesDropdown);

import type { FormData } from '../QuizForm.types';

import { useCallback, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import LocalesDropdown from './LocalesDropdown';

import { languagesArray as _languagesArray, type languages } from '@/constants/languages';
import { MAX, MIN } from '@/constants/locales';

function LocalesArrayField() {
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<FormData>();

  const { fields, append, remove, update } = useFieldArray({
    name: 'locales',
    control,
  });

  const languagesArray = useMemo(() => {
    const result = [];
    const usedLanguages: Partial<Record<keyof typeof languages, boolean>> = {};

    for (const field of fields) {
      usedLanguages[field.language] = true;
    }

    for (const language of _languagesArray) {
      const { id } = language;
      if (usedLanguages[id]) continue;
      result.push(language);
    }

    return result;
  }, [fields]);

  const size = fields.length;
  const disabled = size >= MAX;

  const addLocale = useCallback(() => {
    const [language] = languagesArray;
    append({ language: language.id, main: false, url: '' });
  }, [append, languagesArray]);

  const removeLocale = useCallback(
    (idx: number) => {
      return () => {
        if (size <= MIN) return;
        remove(idx);
      };
    },
    [remove, size],
  );

  return (
    <>
      {fields.map((field, index) => {
        return (
          <div key={field.id} className="mb-6">
            <div className="flex">
              <LocalesDropdown idx={index} field={field} languagesArray={languagesArray} update={update} />
              <div className="relative w-full">
                <input
                  {...register(`locales.${index}.url` as const, {
                    required: true,
                  })}
                  autoComplete="false"
                  className="block p-2.5 w-full z-1 text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-s-gray-100 rounded-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                  placeholder="https://example.com"
                />
                {index >= MIN && (
                  <button
                    type="button"
                    className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium rounded-e-lg dark:hover:text-white dark:hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 hover:bg-red-800 text-gray-300 hover:text-white border border-gray-300 dark:focus:ring-red-900 dark:bg-gray-700 dark:border-gray-600"
                    onClick={removeLocale(index)}
                  >
                    <svg
                      className="w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            {errors.locales?.[index]?.url && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500" role="alert">
                {errors.locales?.[index]?.url?.message}
              </p>
            )}
          </div>
        );
      })}
      <div className="mb-6">
        <button
          className="w-full text-white bg-gray-800 enabled:hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:enabled:hover:bg-gray-700 dark:enabled:focus:ring-gray-700 dark:border-gray-700"
          disabled={disabled}
          type="button"
          onClick={addLocale}
        >
          Add local website
        </button>
      </div>
    </>
  );
}

export default LocalesArrayField;

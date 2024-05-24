import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { memo, useMemo } from 'react';
import type { FieldError } from 'react-hook-form';

type Id = string;

type Props = {
  error: FieldError | undefined;
  value: Id[];
  onChange: (value: Id[]) => void;
  options: { id: Id; name: string }[];
  placeholder: string;
};

function ListboxComponent(props: Props) {
  const { error, options, placeholder, value, onChange } = props;
  const selected = value;

  const idName: Record<(typeof value)[number], string> = useMemo(() => {
    return options.reduce((acc: Record<Id, string>, { id, name }) => {
      acc[id] = name;
      return acc;
    }, {});
  }, [options]);

  return (
    <>
      <Listbox value={selected} onChange={onChange} multiple>
        <ListboxButton className="w-full flex-shrink-0 min-h-11 inline-flex justify-between text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
          <div className="flex flex-wrap gap-1 pt-1">
            {selected.map((id) => (
              <span
                key={id}
                className=" bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
              >
                {idName[id]}
              </span>
            ))}
            {selected.length === 0 && <span className=" text-gray-700 dark:text-gray-400">{placeholder}</span>}
          </div>

          <svg className="flex-none w-3 h-3 ms-3 mt-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg>
        </ListboxButton>
        <ListboxOptions
          anchor={{ gap: 5, to: 'bottom end' }}
          className=" bg-white rounded-lg shadow w-44 dark:bg-gray-700 py-2 text-sm text-gray-700 dark:text-gray-200"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.id}
              value={option.id}
              className="data-[focus]:bg-gray-100 data-[focus]:dark:bg-gray-600 data-[selected]:dark:bg-blue-900 data-[selected]:bg-blue-100 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              {option.name}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500" role="alert">
          {error?.message}
        </p>
      )}
    </>
  );
}

export default memo(ListboxComponent);

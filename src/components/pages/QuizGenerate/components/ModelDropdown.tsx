import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';

// SVG icons
const ChevronDownIcon = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    className="-mr-1 h-5 w-5 text-gray-400 dark:text-gray-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const LoadingSpinner = () => (
  <svg
    aria-hidden="true"
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600 dark:text-gray-400"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export interface DropdownOption {
  id: string | number;
  label: string;
  icon?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'success' | 'warning' | 'danger';
  };
}

interface DropdownProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: DropdownOption[];
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const Dropdown = <T extends FieldValues>({
  name,
  control,
  options,
  isLoading = false,
  disabled = false,
  className = '',
  placeholder = 'Select an option...',
}: DropdownProps<T>) => {
  const badgeVariants = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={`relative w-full ${className}`}>
          <Listbox disabled={disabled || isLoading} value={value} onChange={onChange}>
            {({ open }) => (
              <>
                <ListboxButton
                  className={`
                    relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left
                    shadow-sm ring-1 ring-inset focus:outline-none focus:ring-2 sm:text-sm
                    ${
                      error
                        ? 'ring-red-500 focus:ring-red-500 dark:ring-red-500 dark:focus:ring-red-400'
                        : 'ring-gray-300 focus:ring-blue-500 dark:ring-gray-700 dark:focus:ring-blue-400'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                    bg-white dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                  `}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <LoadingSpinner />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <>
                      <span className="block truncate">
                        {value ? options.find((opt) => opt.id === value)?.label || placeholder : placeholder}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDownIcon />
                      </span>
                    </>
                  )}
                </ListboxButton>

                <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <ListboxOptions
                    className={`
                      absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base
                      shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
                      bg-white dark:bg-gray-800
                      dark:ring-gray-700 dark:shadow-gray-900/10
                    `}
                  >
                    {options.map((option) => (
                      <ListboxOption
                        key={option.id}
                        className={({ focus, selected }) => `
                          relative cursor-default select-none py-2 pl-3 pr-9
                          ${focus ? 'bg-blue-50 text-blue-900 dark:bg-blue-900/50 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}
                          ${selected ? 'bg-blue-100 dark:bg-blue-800' : ''}
                        `}
                        value={option.id}
                      >
                        {({ selected }) => (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {option.icon && (
                                <span
                                  className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2"
                                  dangerouslySetInnerHTML={{ __html: option.icon }}
                                />
                              )}
                              <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>{option.label}</span>
                            </div>
                            {option.badge && (
                              <span
                                className={`
                                  inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ml-2
                                  ${badgeVariants[option.badge.variant || 'default']}
                                `}
                              >
                                {option.badge.text}
                              </span>
                            )}
                          </div>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Transition>
              </>
            )}
          </Listbox>
          {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message}</p>}
        </div>
      )}
    />
  );
};

export default Dropdown;

import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { memo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import * as yup from 'yup';

import type { Locale } from '@/models/Locale';
import type { Quiz } from '@/models/Quiz';
import type { QuizConfiguration } from '@/models/QuizConfiguration';

// Api
import { createManually as createResponderManually } from '@/api/responders';

// Lib
import { toast } from '@/lib/toaster';

const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    group: yup.string(),
  })
  .required();

type NewResponderForm = {
  name: string;
  email: string;
  group?: string;
};

type Props = {
  close: () => void;
  isOpen: boolean;
};

function NewResponderModal({ isOpen, close }: Props) {
  const { quiz, locale, configuration } = useLoaderData() as { configuration: QuizConfiguration; quiz: Quiz; locale: Locale };

  const revalidator = useRevalidator();

  const methods = useForm<NewResponderForm>({
    defaultValues: {
      name: '',
      email: '',
      group: undefined,
    },
    resolver: yupResolver(schema),
  });

  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (data: NewResponderForm) => {
    try {
      const responder = await createResponderManually({
        quizId: quiz.id,
        language: locale.language,

        name: data?.name || '',
        email: data?.email || '',
        group: data?.group || '',
      });
      revalidator.revalidate();
      toast.success('Responder created');
      reset();
      close();
    } catch (error) {
      const message = (error as Error)?.message ?? error;
      toast.error(message);
    }
    console.log(data);
  });

  return (
    <Transition
      show={isOpen}
      enter="duration-200 ease-out"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="duration-300 ease-out"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Dialog onClose={close} className="relative z-50 transition">
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-lg bg-white rounded-lg shadow dark:bg-gray-700">
            <DialogTitle as="div" className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">New Responder</h3>
              <button
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={close}
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </DialogTitle>
            <FormProvider {...methods}>
              <form className="p-4 space-y-1" onSubmit={onSubmit}>
                <div className="mb-2">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Name
                    </label>
                    <input
                      {...register('name')}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Bonnie Green"
                    />
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500 h-5" role="alert">
                      {errors.name ? errors.name?.message : ''}
                    </p>
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Email
                    </label>
                    <input
                      {...register('email')}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="example@domain.com"
                    />
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500 h-5" role="alert">
                      {errors.email ? errors.email?.message : ''}
                    </p>
                  </div>
                  {configuration.fields.includes('group') && (
                    <div>
                      <label htmlFor="group" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Group
                      </label>
                      <input
                        {...register('group')}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="CK-205"
                      />
                      <p className="mt-1 text-sm text-red-600 dark:text-red-500 h-5" role="alert">
                        {errors.group ? errors.group?.message : ''}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                    <title>Add</title>
                  </svg>
                  Add new responder
                </button>
              </form>
            </FormProvider>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}

export default memo(NewResponderModal);

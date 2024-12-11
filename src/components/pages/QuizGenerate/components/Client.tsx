import * as yup from 'yup';

import { getModels } from '@/lib/llm/api';
import { yupResolver } from '@hookform/resolvers/yup';
import { memo, useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { start } from '@/lib/llm/server';

// Components
import ModelDropdown, { type DropdownOption } from './ModelDropdown';

// Types
import type { Model } from '@/lib/llm/types';

type ClientFormData = {
  description?: string;
  model: string;
  name: string;
};

const lightningIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>`;

// const dropdownOptions: DropdownOption[] = [
//   {
//     id: 1,
//     label: 'Administrator',
//     icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
//     </svg>`,
//     badge: {
//       text: 'Full Access',
//       variant: 'success'
//     }
//   },
//   {
//     id: 2,
//     label: 'Regular User',
//     icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//     </svg>`,
//     badge: {
//       text: 'Limited',
//       variant: 'warning'
//     }
//   }
// ]

const schema = yup
  .object({
    model: yup.string().required(),
    name: yup.string().required(),
    description: yup.string(),
  })
  .required();

function Client() {
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const modelOptions = models.map(({ id, name }) => ({
    id,
    label: name,
    icon: lightningIcon,
  }));

  const methods = useForm<ClientFormData>({
    defaultValues: {
      model: '',
      name: '',
      description: '',
    },
    resolver: yupResolver(schema),
  });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const startServer = useCallback(async () => {
    try {
      setLoading(true);
      await start();

      const data = await getModels();
      setModels(data);
      // const result = await completion({
      //   prompt: 'You are an expert quiz maker. Create a quiz with 5 questions about geography',
      //   n_predict: 128,
      // });

      // console.log(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // const download = useCallback(async () => {
  //   const res = await fetch('http://localhost:3010/v1/models/pull', {
  //     method: 'POST',
  //   });
  //   if (!res.body) return;
  //   const reader = res.body.getReader();

  //   const read = async () => {
  //     // read the data
  //     const { done, value } = await reader.read();
  //     // Result objects contain two properties:
  //     // done  - true if the stream has already given you all its data.
  //     // value - some data. Always undefined when done is true.
  //     if (done) {
  //       console.log("[end]");
  //       return;
  //     }

  //     const decoder = new TextDecoder();
  //     console.log("[received]:" + decoder.decode(value));
  //     read();
  //   };

  //   read();
  // }, []);

  const onSubmit = handleSubmit(async (data: ClientFormData) => console.log(data));

  return (
    <FormProvider {...methods}>
      <form className="w-full max-w-lg px-8 pt-3" onSubmit={onSubmit}>
        <div className="mb-6">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Name
          </label>
          <input
            {...register('name')}
            className={`bg-gray-50 border ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            placeholder="Enter Quiz name"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500" role="alert">
              {errors.name?.message}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Describe your quiz"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Model</label>
          <ModelDropdown
            name="model"
            control={control}
            options={modelOptions}
            label="Select Model"
            placeholder="Choose a model..."
            className="w-full"
            isLoading={loading}
          />
        </div>
        <button
          type="button"
          className="px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={startServer}
        >
          Start
        </button>
      </form>
    </FormProvider>
  );
}

export default memo(Client);

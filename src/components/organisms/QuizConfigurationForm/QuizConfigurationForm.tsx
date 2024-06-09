import { toast } from '@/lib/toaster';
import { yupResolver } from '@hookform/resolvers/yup';
import { memo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useLoaderData, useRevalidator, useRouteLoaderData } from 'react-router-dom';

import { save } from '@/api/configuration';

import type { Quiz } from '@/models/Quiz';
import type { QuizConfiguration } from '@/models/QuizConfiguration';

import type { Website } from '@/api/quizzes';
import GlobeIcon from '@/components/atoms/GlobeIcon';
import Listbox from '@/components/molecules/Listbox';
import { schema } from './schema';

import { DEFAULT_FIELDS, DEFAULT_ORDER, FIELD_LABELS, ORDER_LABELS } from '@/constants/configuration';

const identityFieldsOptions = Object.entries(FIELD_LABELS).map(([id, name]) => ({ id, name }));
const orderOptions = Object.entries(ORDER_LABELS).map(([id, name]) => ({ id, name }));

function QuizConfigurationForm() {
  const { quiz } = useRouteLoaderData('quiz-edit') as { quiz: Quiz };
  const { configuration, website } = useLoaderData() as { configuration: QuizConfiguration; website: Website };
  const revalidator = useRevalidator();

  const quizId = quiz.id;

  const methods = useForm<QuizConfiguration>({
    defaultValues: configuration ?? {
      basePath: website.repo,
      fields: DEFAULT_FIELDS,
      order: DEFAULT_ORDER,
    },
    resolver: yupResolver(schema),
  });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: QuizConfiguration) => {
    try {
      await save(quizId, data);
      revalidator.revalidate();
      toast.success('Quiz configuration saved');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="w-full max-w-lg px-8" onSubmit={handleSubmit(onSubmit)}>
        {/* <div className="mb-6">
          <label htmlFor="basePath" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Base path
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              <GlobeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </span>
            <input
              {...register('basePath')}
              className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="quiz-1"
            />
          </div>
          {errors.basePath && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500" role="alert">
              {errors.basePath?.message}
            </p>
          )}
        </div> */}
        <div className="mb-6">
          <label htmlFor="order" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Page order
          </label>
          <select
            {...register('order')}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {orderOptions.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          {errors.order && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500" role="alert">
              {errors.order?.message}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="fields" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Identity fields
          </label>
          <Controller
            name="fields"
            control={control}
            render={({ field, fieldState }) => (
              <Listbox
                error={fieldState.error}
                value={field.value}
                onChange={field.onChange}
                options={identityFieldsOptions}
                placeholder="Select fields..."
              />
            )}
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default memo(QuizConfigurationForm);

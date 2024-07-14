import { toast } from '@/lib/toaster';
import slugify from '@sindresorhus/slugify';
import { memo, useCallback, useState } from 'react';

import { save } from '@/api/configuration';

import type { Locale } from '@/models/Locale';
import type { Quiz } from '@/models/Quiz';
import type { QuizConfiguration } from '@/models/QuizConfiguration';
import type { EditFormData } from './QuizForm.types';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useLoaderData, useNavigate, useRevalidator, useRouteLoaderData } from 'react-router-dom';

import { getMode, remove as removeQuiz, update as updateQuiz, updateRepo } from '@/api/quizzes';

import Listbox from '@/components/molecules/Listbox';
import RemovalModal from '@/components/molecules/RemovalModal';

// Constants
import { DEFAULT_FIELDS, DEFAULT_ORDER, FIELD_LABELS, ORDER_LABELS } from '@/constants/configuration';
import { MODES } from '@/constants/deployment';
import { languages } from '@/constants/languages';

import { editSchema } from './schema';

const identityFieldsOptions = Object.entries(FIELD_LABELS).map(([id, name]) => ({ id, name }));
const languageOptions = Object.entries(languages).map(([id, name]) => ({ id, name }));
const orderOptions = Object.entries(ORDER_LABELS).map(([id, name]) => ({ id, name }));

function QuizEditForm() {
  const navigate = useNavigate();
  const { configuration } = useLoaderData() as { configuration: QuizConfiguration };
  const { locales, quiz } = useRouteLoaderData('quiz-edit') as { quiz: Quiz; locales: Locale[] };
  const quizId = quiz.id;
  const revalidator = useRevalidator();

  const [removalModalOpen, setRemovalModalOpen] = useState(false);

  const closeRemoveModal = useCallback(() => {
    setRemovalModalOpen(false);
  }, []);

  const mainLocale = locales.find(({ main }) => main);

  const methods = useForm<EditFormData>({
    defaultValues: {
      fields: configuration?.fields ?? DEFAULT_FIELDS,
      language: mainLocale?.language,
      name: quiz.name,
      order: configuration?.order ?? DEFAULT_ORDER,
      description: quiz.description,
    },
    resolver: yupResolver(editSchema),
  });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (target: EditFormData) => {
    try {
      await updateQuiz(quizId, { name: target.name, description: target.description ?? '', language: target.language });
      await save(quizId, {
        fields: target.fields,
        order: target.order,
      });

      const mode = await getMode(quizId);
      if (mode === MODES.CREATE) {
        await updateRepo(quiz.id, slugify(target.name));
      }
      revalidator.revalidate();

      toast.success('Quiz updated');
    } catch (error) {
      const message = (error as Error)?.message ?? error;
      toast.error(message);
    }
  });

  const onRemove = useCallback(async () => {
    try {
      await removeQuiz(quizId);
      navigate('/quizzes', { replace: true });
      toast('Quiz removed');
    } catch (error) {
      const message = (error as Error)?.message ?? error;
      toast.error(message);
    }
  }, [quizId, navigate]);

  return (
    <FormProvider {...methods}>
      <form className="w-full max-w-lg px-8" onSubmit={onSubmit}>
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
          <label htmlFor="language" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Language
          </label>
          <select
            {...register('language')}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {languageOptions.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
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
            Update
          </button>
          <button
            type="button"
            className="px-5 py-3.5 text-sm text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
            onClick={() => setRemovalModalOpen(true)}
          >
            Remove
          </button>
        </div>
        <RemovalModal
          isOpen={removalModalOpen}
          close={closeRemoveModal}
          message="Are you sure you want to delete this Quiz?"
          onRemove={onRemove}
        />
      </form>
    </FormProvider>
  );
}

export default memo(QuizEditForm);

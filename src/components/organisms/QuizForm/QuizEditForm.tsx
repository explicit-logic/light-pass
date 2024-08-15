import { toast } from '@/lib/toaster';
import slugify from '@sindresorhus/slugify';
import { memo, useCallback, useState } from 'react';

import { clear as clearBuilder } from '@/api/builder';
import { save } from '@/api/configuration';
import { create as createMessages, remove as removeMessages } from '@/api/messages';

import type { Locale } from '@/models/Locale';
import type { Quiz } from '@/models/Quiz';
import type { QuizConfiguration } from '@/models/QuizConfiguration';
import type { EditFormData } from './QuizForm.types';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useLoaderData, useNavigate, useRevalidator, useRouteLoaderData } from 'react-router-dom';

import { getMode, remove as removeQuiz, update as updateQuiz, updateRepo } from '@/api/quizzes';

// Components
import Listbox from '@/components/molecules/Listbox';
import RemovalModal from '@/components/molecules/RemovalModal';
import TimeLimitDurationField from './components/TimeLimitDurationField';
import TimeLimitTypeField from './components/TimeLimitTypeField';

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
      timeLimit: {
        type: configuration.timeLimitType,
        duration: configuration.timeLimitDuration ?? 0,
      },
    },
    resolver: yupResolver(editSchema),
  });
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { isDirty, errors },
    watch,
  } = methods;

  const onSubmit = handleSubmit(async (target: EditFormData) => {
    try {
      const timeLimit =
        target.timeLimit?.type && target.timeLimit?.duration
          ? target.timeLimit.type.concat(target.timeLimit.duration.toString())
          : undefined;

      if (mainLocale?.language !== target.language) {
        if (mainLocale?.language) {
          await clearBuilder(quiz.id, mainLocale.language);
          await removeMessages(quiz.id, mainLocale.language);
        }
        await createMessages(quiz, target.language);
      }

      await updateQuiz(quizId, { name: target.name, description: target.description ?? '', language: target.language });

      await save(quizId, {
        fields: target.fields,
        order: target.order,
        timeLimit,
      });

      const mode = await getMode(quizId);
      if (mode === MODES.CREATE) {
        await updateRepo(quiz.id, slugify(target.name));
      }
      revalidator.revalidate();

      toast.success('Quiz updated');
    } catch (error) {
      console.error(error);
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
          <label htmlFor="timeLimit.type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Time limit for question pages
          </label>
          <Controller
            name="timeLimit.type"
            control={control}
            render={({ field, fieldState }) => (
              <TimeLimitTypeField error={fieldState.error} value={field.value} onChange={field.onChange} setValue={setValue} />
            )}
          />
          <Controller
            name="timeLimit.duration"
            control={control}
            render={({ field, fieldState }) => (
              <TimeLimitDurationField
                error={fieldState.error}
                hidden={!watch('timeLimit.type')}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
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
            className={`${
              isDirty
                ? 'hover:bg-blue-800 bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                : 'bg-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
            } px-5 py-3 text-base font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800`}
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

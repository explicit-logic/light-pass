import type { FormData } from './QuizForm.types';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router-dom';

import { type Locale, create as createLocale, removeAll as removeAllLocales } from '@/api/locales';
import { type Quiz, remove as removeQuiz, update as updateQuiz } from '@/api/quizzes';

import LocalesArrayField from './components/LocalesArrayField';

import { useCallback } from 'react';
import { schema } from './schema';

function QuizEditForm() {
  const navigate = useNavigate();
  const { locales, quiz } = useLoaderData() as { quiz: Quiz; locales: Locale[] };
  const quizId = quiz.id;

  console.log(quiz);

  const methods = useForm<FormData>({
    defaultValues: {
      locales,
      name: quiz.name,
      description: quiz.description,
    },
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (data: FormData) => {
    const { locales, name, description } = data;
    await removeAllLocales(quizId);
    await updateQuiz(quizId, { name, description: description ?? '' });
    for (const locale of locales) {
      await createLocale({ ...locale, quizId: quiz.id });
    }
    return navigate('/quizzes', { replace: true });
  });

  const onRemove = useCallback(async () => {
    await removeAllLocales(quizId);
    await removeQuiz(quizId);
    navigate('/quizzes', { replace: true });
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
        <LocalesArrayField />
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
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default QuizEditForm;

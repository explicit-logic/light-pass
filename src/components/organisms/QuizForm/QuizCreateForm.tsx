import type { FormData } from './QuizForm.types';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { create as createLocale, removeAll as removeAllLocales } from '@/api/locales';
import { type Quiz, create as createQuiz, remove as removeQuiz } from '@/api/quizzes';

import LocalesArrayField from './components/LocalesArrayField';

import { DEFAULT_LANGUAGE } from '@/constants/languages';
import { schema } from './schema';

function QuizCreateForm() {
  const navigate = useNavigate();
  const methods = useForm<FormData>({
    defaultValues: {
      locales: [{ language: DEFAULT_LANGUAGE, main: true, url: '' }],
      name: '',
      description: '',
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
    let quiz: Quiz | null = null;
    try {
      quiz = await createQuiz({ name, description: description ?? '' });
      for (const locale of locales) {
        await createLocale({ ...locale, quizId: quiz.id });
      }
      return navigate('/quizzes', { replace: true });
    } catch (error) {
      if (quiz) {
        await removeAllLocales(quiz.id);
        await removeQuiz(quiz.id);
      }
      return;
    }
  });

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
        <button
          type="submit"
          className="px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Create
        </button>
      </form>
    </FormProvider>
  );
}

export default QuizCreateForm;

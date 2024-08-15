import type { CreateFormData } from './QuizForm.types';

import { yupResolver } from '@hookform/resolvers/yup';
import slugify from '@sindresorhus/slugify';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { toast } from '@/lib/toaster';

import type { Quiz } from '@/models/Quiz';

import { createFromQuiz as createConfiguration } from '@/api/configuration';
import { removeAll as removeAllLocales, upsert as upsertLocale } from '@/api/locales';
import { create as createMessages } from '@/api/messages';
import { create as createQuiz, remove as removeQuiz, updateRepo } from '@/api/quizzes';

import { languages } from '@/constants/languages';
import { createSchema } from './schema';

const languageOptions = Object.entries(languages).map(([id, name]) => ({ id, name }));

function QuizCreateForm() {
  const navigate = useNavigate();
  const methods = useForm<CreateFormData>({
    defaultValues: {
      language: undefined,
      name: '',
      description: '',
    },
    resolver: yupResolver(createSchema),
  });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (data: CreateFormData) => {
    const { language, name, description } = data;
    let quiz: Quiz | null = null;
    try {
      const repo = slugify(name);
      quiz = await createQuiz({ name, description: description ?? '', repo });
      await upsertLocale({
        language,
        main: true,
        quizId: quiz.id,
        url: '',
      });
      await createMessages(quiz, language);
      await createConfiguration(quiz);

      navigate(`/quizzes/${quiz.id}/edit`, { replace: true });

      toast.success('Quiz created');

      return;
    } catch (error) {
      if (quiz) {
        await removeAllLocales(quiz.id);
        await removeQuiz(quiz.id);
      }
      const message = (error as Error)?.message ?? error;
      toast.error(message);
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

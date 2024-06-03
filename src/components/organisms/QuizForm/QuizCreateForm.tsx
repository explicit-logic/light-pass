import type { CreateFormData } from './QuizForm.types';

import { yupResolver } from '@hookform/resolvers/yup';
import slugify from '@sindresorhus/slugify';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { toast } from '@/lib/toaster';

import type { Quiz } from '@/models/Quiz';

import { removeAll as removeAllLocales, upsert as upsertLocale } from '@/api/locales';
import { create as createQuiz, remove as removeQuiz, updateRepo } from '@/api/quizzes';

import Listbox from '@/components/molecules/Listbox';

import { languages } from '@/constants/languages';
import { createSchema } from './schema';

const languageOptions = Object.entries(languages).map(([id, name]) => ({ id, name, highlight: id === 'uk' }));

function QuizCreateForm() {
  const navigate = useNavigate();
  const methods = useForm<CreateFormData>({
    defaultValues: {
      languages: [],
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
    const { languages, name, description } = data;
    let quiz: Quiz | null = null;
    try {
      quiz = await createQuiz({ name, description: description ?? '' });
      let main = true;
      for (const language of languages) {
        await upsertLocale({
          language,
          main,
          quizId: quiz.id,
          url: `https://example.com/${language}`,
        });
        main = false;
      }
      await updateRepo(quiz.id, slugify(name));
      navigate('/quizzes', { replace: true });

      toast.success('Quiz created');

      return;
    } catch (error) {
      if (quiz) {
        await removeAllLocales(quiz.id);
        await removeQuiz(quiz.id);
      }
      toast.error(error instanceof Error ? error.message : (error as string));
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
          <label htmlFor="fields" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Languages
          </label>
          <Controller
            name="languages"
            control={control}
            render={({ field, fieldState }) => (
              <Listbox
                error={fieldState.error}
                value={field.value}
                onChange={field.onChange}
                options={languageOptions}
                placeholder="Select languages..."
              />
            )}
          />
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

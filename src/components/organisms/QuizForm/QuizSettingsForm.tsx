import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useRevalidator, useRouteLoaderData } from 'react-router-dom';

import { toast } from '@/lib/toaster';

import type { Locale } from '@/models/Locale';
import type { Quiz } from '@/models/Quiz';
import type { SettingsFormData } from './QuizForm.types';

import { remove as removeLocale, updateUrl as updateLocaleUrl, upsert as upsertLocale } from '@/api/locales';

import LocalesArrayField from './components/LocalesArrayField';

import { languages } from '@/constants/languages';
import { settingsSchema } from './schema';

import { getChanges as getLocaleChanges } from './helpers/locales';

function QuizSettingsForm() {
  const { locales, quiz } = useRouteLoaderData('quiz-edit') as { quiz: Quiz; locales: Locale[] };

  const quizId = quiz.id;
  const revalidator = useRevalidator();

  const methods = useForm<SettingsFormData>({
    defaultValues: {
      locales,
    },
    resolver: yupResolver(settingsSchema),
  });
  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (target: SettingsFormData) => {
    try {
      const { created: createdLocales, deleted: deletedLocales, updated: updatedLocales } = getLocaleChanges(locales, target.locales);

      for (const deletedLocale of deletedLocales) {
        await removeLocale(quizId, deletedLocale.language);
      }

      for (const createdLocale of createdLocales) {
        await upsertLocale({ ...createdLocale, quizId });
      }

      for (const { language, url } of updatedLocales) {
        await updateLocaleUrl({ quizId, language, url });
      }
      revalidator.revalidate();

      toast.success('Locales updated');

      return;
    } catch (error) {
      const message = (error as Error)?.message ?? error;
      toast.error(message);
    }
  });

  return (
    <FormProvider {...methods}>
      <form className="w-full max-w-lg" onSubmit={onSubmit}>
        <LocalesArrayField />
        <button
          type="submit"
          className="px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Update
        </button>
      </form>
    </FormProvider>
  );
}

export default QuizSettingsForm;

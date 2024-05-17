import { Link, useParams, useRouteLoaderData } from 'react-router-dom';

import { languages } from '@/constants/languages';
import type { Locale } from '@/models/Locale';

const getLabel = (key: Locale['language']) => languages[key];

export function Component() {
  const { quizId } = useParams() as { quizId: string };
  const { locales } = useRouteLoaderData('quiz-edit') as { locales: Locale[] };

  return (
    <>
      <div className="pl-4">
        <ol className="space-y-4 w-72">
          {locales.map((locale) => (
            <li key={locale.language}>
              <Link
                to={`/quizzes/${quizId}/locales/${locale.language}/edit`}
                className={`group block w-full p-4 border rounded-lg ${
                  locale.completed
                    ? 'text-green-700 border-green-300 bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400'
                    : 'text-gray-900 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                } hover:bg-blue-100 hover:text-blue-700 hover:dark:text-blue-400 hover:border-blue-300 hover:dark:border-blue-800`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{getLabel(locale.language)}</h3>

                  <svg
                    className="rtl:rotate-180 w-4 h-4 hidden group-hover:block"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                  </svg>
                  {locale.completed && (
                    <svg
                      className="w-4 h-4 group-hover:hidden"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 16 12"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5.917 5.724 10.5 15 1.5"
                      />
                    </svg>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

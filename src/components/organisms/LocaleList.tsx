import { Link, useParams } from 'react-router-dom';

const locales = [
  {
    id: 'en',
    name: 'English',
  },
  {
    id: 'uk',
    name: 'Українська',
  },
  {
    id: 'ru',
    name: 'Русский',
  },
];

function LocaleList() {
  const { quizId } = useParams();

  return (
    <div className="mt-12">
      <div className="w-48">
        {locales.map((locale) => (
          <Link
            key={locale.id}
            className="w-full block text-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            to={`/quizzes/${quizId}/locales/${locale.id}`}
          >
            {locale.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LocaleList;

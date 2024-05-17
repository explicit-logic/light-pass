import { memo, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getMany } from '@/api/locales';
import type { Locale } from '@/models/Locale';

import { languages } from '@/constants/languages';

const getLabel = (key: Locale['language']) => languages[key];

function LocaleList() {
  const { quizId } = useParams();

  const [locales, setLocales] = useState<Locale[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getMany(Number(quizId));

      setLocales(data);
    };

    getData();
  }, [quizId]);

  return (
    <div className="mt-12">
      <div className="w-48">
        {locales.map((locale) => (
          <Link
            key={locale.language}
            className="w-full block text-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            to={`/quizzes/${quizId}/locales/${locale.language}/join`}
          >
            {getLabel(locale.language)}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default memo(LocaleList);

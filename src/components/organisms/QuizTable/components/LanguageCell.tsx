import type { Quiz } from '@/models/Quiz';
import type { Row } from '@tanstack/react-table';

type Props = {
  row: Row<Quiz>;
};

function LanguageCell(props: Props) {
  const { row } = props;
  const { original } = row;
  const { mainLanguage } = original;

  return (
    <span className="text-gray-800 font-semibold bg-gray-200 rounded-lg px-2 py-1 dark:bg-gray-700 dark:text-white">{mainLanguage}</span>
  );
}

export default LanguageCell;

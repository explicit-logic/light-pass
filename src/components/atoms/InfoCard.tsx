import { type ReactNode, memo } from 'react';

export type Item = {
  id: number;
  label: string;
  value: ReactNode;
};

function InfoCard(props: { items: Item[] }) {
  const { items } = props;

  return (
    <div className="m-auto max-w-lg text-base text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 overflow-x-auto shadow-md sm:rounded-lg">
      {items.map(({ id, label, value }, index) => (
        <div key={id} className={`flex flex-row ${index !== items.length - 1 ? 'border-b dark:border-gray-700' : ''}`}>
          <div className="flex-none w-52 px-2 py-2 text-center text-base font-medium text-gray-900 whitespace-nowrap dark:text-white border-r dark:bg-gray-800 dark:border-gray-700">
            {label}
          </div>
          <div className="px-2 py-2">{value}</div>
        </div>
      ))}
    </div>
  );
}

export default memo(InfoCard);

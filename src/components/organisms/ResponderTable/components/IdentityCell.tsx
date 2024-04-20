import type { Row } from '@tanstack/react-table';

type Props = {
  row: Row<ResponderInterface>;
};

function IdentityCell(props: Props) {
  const { row } = props;
  const { original } = row;

  if (!original.identified) {
    return (
      <div className="flex flex-col space-y-2 animate-pulse" role="status">
        <div className="inline-flex w-[150px] h-[20px] bg-gray-200 rounded-md dark:bg-gray-700" />
        <div className="inline-flex w-[180px] h-[15px] bg-gray-200 rounded-md dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <div className="flex items-center text-gray-900 whitespace-nowrap dark:text-white">
      {/* <img className="w-10 h-10 rounded-full" src={`https://source.unsplash.com/40x40/?portrait&${original.id}`} alt="Jese" /> */}
      <div className="ps-3">
        <div className="text-base font-semibold">{original.name}</div>
        <div className="font-normal text-gray-500">{original.email}</div>
      </div>
    </div>
  );
}

export default IdentityCell;

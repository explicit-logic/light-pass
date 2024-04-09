import QrIcon from '@/components/atoms/QrIcon';

function ConnectSkeleton() {
  return (
    <div className="flex justify-center pt-6 w-full">
      <div role="status" className="animate-pulse w-[474px]">
        <div className="flex items-center rounded-md justify-center h-[474px] w-[474px] mb-6 bg-gray-300 dark:bg-gray-700">
          <QrIcon className="w-80 h-80 dark:text-gray-600" />
        </div>
        <div className="h-[42px] w-full bg-gray-200 rounded-md dark:bg-gray-700 mb-6" />
        <div className="flex flex-row h-[52px] justify-center space-y-0 space-x-4 w-full">
          <div className="inline-flex w-[141px] h-full bg-gray-200 rounded-md dark:bg-gray-700" />
          <div className="inline-flex w-[155px] h-full bg-gray-200 rounded-md dark:bg-gray-700" />
        </div>

        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default ConnectSkeleton;

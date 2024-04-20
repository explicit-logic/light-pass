import { STATES } from '@/constants/connection';

function Flasher({ state }: { state: ConnectionStateType }) {
  if (state === STATES.ONLINE) {
    return (
      <div className="flex items-center">
        {/* <div className="h-2.5 w-2.5 rounded-full bg-primary-500 me-2" /> */}
        <div className="flex relative h-2.5 w-2.5 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500" />
        </div>
        <span>Online</span>
      </div>
    );
  }

  if (state === STATES.ERROR) {
    return (
      <div className="flex items-center">
        <div className="h-2.5 w-2.5 rounded-full bg-amber-500 dark:bg-amber-400 me-2" />
        <span>Error</span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <div className="h-2.5 w-2.5 rounded-full bg-gray-500 me-2" /> Offline
    </div>
  );
}

export default Flasher;

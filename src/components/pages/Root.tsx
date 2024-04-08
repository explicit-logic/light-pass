import { Outlet } from 'react-router-dom';

// Providers
import { ConnectionProvider } from '@/providers/ConnectionProvider';

function Root() {
  return (
    <>
      <ConnectionProvider>
        <Outlet />
      </ConnectionProvider>
    </>
  );
}

export default Root;

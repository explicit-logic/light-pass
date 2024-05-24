import { Outlet } from 'react-router-dom';

// Components
import Toaster from '@/components/organisms/Toaster';

// Providers
import { ConnectionProvider } from '@/providers/ConnectionProvider';

function Root() {
  return (
    <>
      <Toaster />
      <ConnectionProvider>
        <Outlet />
      </ConnectionProvider>
    </>
  );
}

export default Root;

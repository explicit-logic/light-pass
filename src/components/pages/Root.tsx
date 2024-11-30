import NiceModal from '@ebay/nice-modal-react';
import { Outlet } from 'react-router-dom';

// Components
import Toaster from '@/components/organisms/Toaster';

// Providers
import { ConnectionProvider } from '@/providers/ConnectionProvider';

function Root() {
  return (
    <>
      <Toaster />
      <NiceModal.Provider>
        <ConnectionProvider>
          <Outlet />
        </ConnectionProvider>
      </NiceModal.Provider>
    </>
  );
}

export default Root;

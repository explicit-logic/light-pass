import { Outlet, useNavigation } from 'react-router-dom';

import Header from '@/components/molecules/Header';

function Root() {
  const { state } = useNavigation();

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default Root;

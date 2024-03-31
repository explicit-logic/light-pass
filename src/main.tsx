import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// import App from './App';
import Root from '@/components/pages/Root';
import './styles.css';

// Helpers
import { onCloseRequested } from '@/helpers/onCloseRequested';

void onCloseRequested();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

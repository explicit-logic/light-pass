import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';

import Root from '@/components/pages/Root';

import QuizCreate from '@/components/pages/QuizCreate';
import QuizJoin from '@/components/pages/QuizJoin';
import QuizList from '@/components/pages/QuizList';

import './styles.css';

// Helpers
import { onCloseRequested } from '@/helpers/onCloseRequested';

void onCloseRequested();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        loader: () => redirect('quizzes/1/locales/en'),
      },
      {
        path: 'quizzes',
        element: <QuizList />,
      },
      {
        path: 'quizzes/create',
        element: <QuizCreate />,
      },
      {
        path: 'quizzes/:quizId/locales/:locale',
        element: <QuizJoin />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';

import Root from '@/components/pages/Root';

import LocaleList, { loader as localeListLoader } from '@/components/pages/LocaleList';
import QuizCreate from '@/components/pages/QuizCreate';
import QuizEdit, { loader as quizEditLoader } from '@/components/pages/QuizEdit';
import QuizJoin, { loader as quizJoinLoader } from '@/components/pages/QuizJoin';
import QuizList from '@/components/pages/QuizList';
import ResponderList, { loader as responderListLoader } from '@/components/pages/ResponderList';

import './styles.css';

// Helpers
import { onCloseRequested } from '@/helpers/onCloseRequested';
import { requestNotificationPermission } from '@/helpers/requestNotificationPermission';

void requestNotificationPermission();
void onCloseRequested();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        // loader: () => redirect('quizzes/1/locales/en/responders'),
        loader: () => redirect('quizzes'),
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
        path: 'quizzes/:quizId/edit',
        element: <QuizEdit />,
        loader: quizEditLoader,
      },
      {
        path: 'quizzes/:quizId/locales',
        element: <LocaleList />,
        loader: localeListLoader,
      },
      {
        path: 'quizzes/:quizId/locales/:language',
        element: <QuizJoin />,
        loader: quizJoinLoader,
      },
      {
        path: 'quizzes/:quizId/locales/:language/responders',
        element: <ResponderList />,
        loader: responderListLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

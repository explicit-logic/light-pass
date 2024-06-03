import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';

import Root from '@/components/pages/Root';

import './animation.css';
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
        lazy: () => import('@/components/pages/QuizList'),
      },
      {
        path: 'quizzes/create',
        lazy: () => import('@/components/pages/QuizCreate'),
      },
      {
        id: 'quiz-edit',
        path: 'quizzes/:quizId/edit',
        lazy: () => import('@/components/pages/QuizEdit'),
        children: [
          {
            index: true,
            lazy: () => import('@/components/pages/QuizEditDetails'),
          },
          {
            path: 'configuration',
            lazy: () => import('@/components/pages/QuizEditConfiguration'),
          },
          {
            path: 'deployment',
            lazy: () => import('@/components/pages/QuizEditDeployment'),
          },
          {
            path: 'locale',
            lazy: () => import('@/components/pages/QuizEditLocale'),
          },
        ],
      },
      {
        path: 'quizzes/:quizId/locales',
        lazy: () => import('@/components/pages/LocaleList'),
      },
      {
        id: 'locale-edit',
        path: 'quizzes/:quizId/locales/:language/edit',
        lazy: () => import('@/components/pages/LocaleEdit'),
        children: [
          {
            index: true,
            lazy: () => import('@/components/pages/LocaleEditQuestions'),
          },
          {
            path: 'text',
            lazy: () => import('@/components/pages/LocaleEditText'),
          },
        ],
      },
      {
        path: 'quizzes/:quizId/locales/:language/join',
        lazy: () => import('@/components/pages/QuizJoin'),
      },
      {
        path: 'quizzes/:quizId/locales/:language/responders',
        lazy: () => import('@/components/pages/ResponderList'),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

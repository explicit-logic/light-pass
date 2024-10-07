import { getOne as getOneQuiz } from '@/api/quizzes';
import { getOne as getOneResponder } from '@/api/responders';
import type { Quiz } from '@/models/Quiz';
import { type LoaderFunction, useLoaderData } from 'react-router-dom';

import Header from '@/components/molecules/Header';

export const loader: LoaderFunction = async ({ params }) => {
  const { responderId } = params as unknown as { responderId: string };

  const responder = await getOneResponder(Number(responderId));
  const quiz = await getOneQuiz(responder.quizId);

  return {
    quiz,
    responder,
  };
};

export function Component() {
  const { quiz } = useLoaderData() as { quiz: Quiz };

  return (
    <>
      <Header title={quiz.name} />
      <div className="mx-auto pb-20">
        <div className="sticky z-10 top-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3">
          <div className="flex flex-row space-x-3">
            <button
              type="button"
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h3 className="font-semibold leading-7 text-gray-900 text-2xl mb-2 dark:text-white" id="home">
                John Doe
              </h3>
              <p className="mt-1 max-w-2xl text-base leading-6 text-gray-500 dark:text-gray-400">john@mail.com</p>
            </div>
          </div>
        </div>
        <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
          <dl>
            <div className="py-1 sm:grid sm:grid-cols-5">
              <dt className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Time</dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 dark:text-gray-200">
                <time>27.03.2024 14:25:04 - 15:11:23</time>
              </dd>
            </div>
            <div className="py-1 sm:grid sm:grid-cols-5">
              <dt className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Duration</dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 dark:text-gray-200">
                <time>34:07</time>
              </dd>
            </div>
            <div className="py-1 sm:grid sm:grid-cols-5">
              <dt className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Progress</dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 dark:text-gray-200">3 / 5</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col sm:flex-row h-screen">
          <aside className="sticky sm:top-32 sm:h-[calc(100vh-theme(spacing.52))] sm:w-60 sm:overflow-y-auto w-full px-2 py-3 bg-white dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              <li>
                <button
                  type="button"
                  className="flex items-center h-10 whitespace-nowrap w-full px-2 text-gray-900 rounded-lg bg-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <span className="tabular-nums">15 / 33</span>
                  <span className="block h-full border-r border-gray-500 mx-1" />
                  <span className="text-ellipsis overflow-hidden">Very Long the name of Page</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="flex items-center h-10 whitespace-nowrap w-full px-2 text-gray-900 rounded-lg bg-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <span className="tabular-nums">33 / 33</span>
                  <span className="block h-full border-r border-gray-500 mx-1" />
                  <span className="text-ellipsis overflow-hidden">Page 2</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="flex items-center h-10 whitespace-nowrap w-full px-2 text-gray-900 rounded-lg bg-blue-600 dark:text-white"
                >
                  <span className="tabular-nums">03 / 09</span>
                  <span className="block h-full border-r border-gray-300 mx-1" />
                  <span className="text-ellipsis overflow-hidden">Active Page 3</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="flex items-center h-10 whitespace-nowrap w-full px-2 text-gray-900 rounded-lg bg-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <span className="text-ellipsis overflow-hidden">Page 4</span>
                </button>
              </li>
            </ul>
          </aside>
          <main className="w-full py-3 px-2 space-y-6">
            <div className="flex flex-row justify-between">
              <div className="space-y-2">
                <label className="text-base leading-6 text-gray-500 dark:text-white">What is the largest city in the world?</label>
                <div className="">
                  <p className="italic text-sm font-medium text-green-500 underline underline-offset-8">Tokyo</p>
                </div>
              </div>
              <div>
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    className="group inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-white border-r border-gray-200 rounded-s-lg focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-blue-500"
                  >
                    <svg
                      className="w-5 h-5 text-gray-800 dark:text-gray-200 group-hover:text-red-500"
                      aria-hidden="true"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 256 256"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H72a8,8,0,0,1,0-16H184a8,8,0,0,1,0,16Z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="group inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-white focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-blue-500"
                  >
                    <svg
                      className="w-5 h-5 text-gray-800 dark:text-gray-200 group-hover:text-yellow-300"
                      aria-hidden="true"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 256 256"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM56,96a8,8,0,0,1,8-8H80V72a8,8,0,0,1,16,0V88h16a8,8,0,0,1,0,16H96v16a8,8,0,0,1-16,0V104H64A8,8,0,0,1,56,96Zm24,96a8,8,0,0,1-5.66-13.66l96-96a8,8,0,0,1,11.32,11.32l-96,96A8,8,0,0,1,80,192Zm112-8H144a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="group inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-white border-l border-gray-200 rounded-e-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-blue-500"
                  >
                    <svg
                      className="w-5 h-5 text-gray-800 dark:text-gray-200 group-hover:text-green-500"
                      aria-hidden="true"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 448 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-base leading-6 text-gray-500 dark:text-white">Who is the richest man in the world?</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="default-radio-1"
                    disabled
                    type="radio"
                    value=""
                    name="default-radio-1"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Option
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    defaultChecked
                    disabled
                    id="default-radio-2"
                    type="radio"
                    value=""
                    name="default-radio-2"
                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-red-500">
                    Wrong Answer
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    defaultChecked
                    disabled
                    id="default-radio-2"
                    type="radio"
                    value=""
                    name="default-radio-3"
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-green-500">
                    Right Choice
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="default-radio-1"
                    disabled
                    type="radio"
                    value=""
                    name="default-radio-4"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-green-500">
                    Correct answer
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-base leading-6 text-gray-500 dark:text-white">
                What is the difference between a sea and an ocean?
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    disabled
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Answer
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    defaultChecked
                    disabled
                    id="default-checkbox"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-red-500">
                    Wrong Answer
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    defaultChecked
                    disabled
                    id="checked-checkbox"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checked-checkbox" className="ms-2 text-sm font-medium text-green-500">
                    Right choice
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    disabled
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checked-checkbox" className="ms-2 text-sm font-medium text-green-500">
                    Correct answer
                  </label>
                </div>
              </div>
            </div>
          </main>
        </div>

        <div className="fixed w-full left-0 bottom-0 py-4 bg-gray-800">
          <div className="flex flex-col px-3 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-6">
            <div className="flex flex-row items-center justify-center space-x-4">
              <div className="text-2xl font-medium leading-6 text-gray-900 dark:text-white">Final Mark</div>
              <div className="flex flex-row space-x-1">
                <input
                  type="text"
                  inputMode="numeric"
                  id="large-input"
                  defaultValue={71}
                  className="block w-20 px-4 text-gray-900 text-center border border-gray-300 rounded-lg bg-gray-50 text-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <div className="text-base font-medium leading-6 text-gray-900 dark:text-white py-3">&nbsp;/&nbsp;</div>
                <div className="text-xl font-medium leading-6 text-gray-900 dark:text-white py-3">
                  <span>100</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full sm:w-60 py-3 text-base font-medium text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

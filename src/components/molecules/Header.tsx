import { Link, useLocation } from 'react-router-dom';

function Header() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 w-full border-b-2 border-gray-100 dark:border-gray-800">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 h-[3.5rem]">
        <div className="flex items-center h-full">
          <div className="flex flex-1 justify-start items-center">
            <Link to="quizzes" className="flex items-center">
              <div className="flex justify-center items-center w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.122 17.645a7.185 7.185 0 0 1-2.656 2.495 7.06 7.06 0 0 1-3.52.853 6.617 6.617 0 0 1-3.306-.718 6.73 6.73 0 0 1-2.54-2.266c-2.672-4.57.287-8.846.887-9.668A4.448 4.448 0 0 0 8.07 6.31 4.49 4.49 0 0 0 7.997 4c1.284.965 6.43 3.258 5.525 10.631 1.496-1.136 2.7-3.046 2.846-6.216 1.43 1.061 3.985 5.462 1.754 9.23Z"
                  />
                </svg>
              </div>
            </Link>
          </div>

          <div className="flex flex-1 justify-center items-center">
            <span className="self-center text-xl whitespace-nowrap dark:text-white">Next.js Quiz</span>
          </div>

          <div className="flex flex-1 justify-end items-center">
            {pathname === '/quizzes' && (
              <Link
                to="quizzes/create"
                className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                Create
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;

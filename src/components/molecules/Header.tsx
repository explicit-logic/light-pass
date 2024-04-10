import { Link } from 'react-router-dom';
import JoinButton from './JoinButton';

function Header(params: { left?: React.ReactNode; right?: React.ReactNode; title?: string }) {
  const { left, right, title } = params;

  return (
    <header className="sticky top-0 w-full border-b-2 border-gray-100 dark:border-gray-800">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 h-[3.5rem]">
        <div className="flex items-center h-full">
          <div className="flex flex-1 justify-start items-center gap-0.5">
            <Link to="/quizzes" className="flex justify-center items-center p-1 rounded-lg dark:hover:bg-gray-700 hover:bg-gray-200">
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Zm4.996 2a1 1 0 0 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM11 8a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-6Zm-4.004 3a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM11 11a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-6Zm-4.004 3a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM11 14a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-6Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <JoinButton />
            {left}
          </div>

          <div
            title={title}
            className="hidden sm:flex cursor-default select-none items-center self-center text-xl whitespace-nowrap dark:text-white overflow-hidden"
          >
            {title}
          </div>

          <div className="flex flex-1 justify-end items-center">{right}</div>
        </div>
      </nav>
    </header>
  );
}

export default Header;

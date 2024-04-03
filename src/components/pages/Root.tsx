import { Link, Outlet } from 'react-router-dom';

function Root() {
  return (
    <>
      <header className='sticky top-0 z-50'>
        <nav className='bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800'>
          <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl'>
            <Link to='quizzes' className='flex items-center'>
              <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>Simple Quiz</span>
            </Link>
            <div className='flex items-center lg:order-2'>
              <Link
                to='quizzes/create'
                className='text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800'
              >
                Create
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  );
}

export default Root;

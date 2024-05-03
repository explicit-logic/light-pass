import { useNavigate, useParams } from 'react-router-dom';

function RespondersButton() {
  const { quizId, language } = useParams();
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/quizzes/${quizId}/locales/${language}/responders`);
  };

  return (
    <button
      className="bg-blue-700 dark:bg-blue-600 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-700 focus:ring-blue-300 dark:focus:ring-blue-800 inline-flex justify-center items-center py-3.5 px-5 text-white font-medium rounded-lg text-sm me-2 mb-2 focus:ring-4 focus:outline-none disabled:cursor-not-allowed"
      type="button"
      onClick={onClick}
    >
      <svg
        className="w-6 h-6 me-3 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          fillRule="evenodd"
          d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
          clipRule="evenodd"
        />
      </svg>
      Responders
    </button>
  );
}

export default RespondersButton;

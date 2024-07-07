import { memo } from 'react';
import { NavLink } from 'react-router-dom';

type Props = {
  caption?: string;
  children?: React.ReactNode;
  completed?: boolean;
  disabled?: boolean;
  to: string;
  title: string;
};

function CompletedIcon() {
  return (
    <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
      <svg
        className="w-3.5 h-3.5 text-green-500 dark:text-green-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 16 12"
      >
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
      </svg>
    </span>
  );
}

function Content(props: Props) {
  const { caption = '', children, completed = false, title } = props;

  return (
    <>
      {completed ? (
        CompletedIcon()
      ) : (
        <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
          {children}
        </span>
      )}
      <h3 className="font-medium leading-tight">{title}</h3>
      <p className="text-sm">{caption}</p>
    </>
  );
}

function SideBarLink(props: Props) {
  const { disabled = false, to } = props;

  return (
    <li className="mb-10 ms-6">
      {disabled ? (
        <Content {...props} />
      ) : (
        <NavLink to={to} className={({ isActive }) => (isActive ? 'text-blue-600 dark:text-blue-500' : '')} end>
          <Content {...props} />
        </NavLink>
      )}
    </li>
  );
}

export default memo(SideBarLink);

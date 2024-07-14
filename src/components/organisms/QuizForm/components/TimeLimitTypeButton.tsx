import { memo } from 'react';

export const POSITIONS = Object.freeze({
  left: 'left',
  center: 'center',
  right: 'right',
} as const);

type Props = {
  active?: boolean;
  caption?: string;
  children?: React.ReactNode;
  position: (typeof POSITIONS)[keyof typeof POSITIONS];
  onClick: () => void;
};

function TimeLimitTypeButton(props: Props) {
  const { active = false, caption, children, onClick, position } = props;

  return (
    <button
      type="button"
      className={`${
        active
          ? position === POSITIONS.center
            ? 'bg-gray-100 dark:text-white dark:bg-gray-700'
            : 'text-primary-700 dark:text-white bg-gray-100 dark:bg-primary-700'
          : 'bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:hover:text-white dark:hover:bg-gray-700'
      } ${position === POSITIONS.center ? 'border-t border-b' : 'border'} ${position === POSITIONS.left ? 'rounded-s-lg' : ''} ${
        position === POSITIONS.right ? 'rounded-e-lg' : ''
      } inline-flex items-center px-4 py-2 text-sm font-medium border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-700 dark:focus:ring-blue-500 dark:focus:text-white`}
      onClick={onClick}
      disabled={active}
    >
      {children}
      {caption}
    </button>
  );
}

export default memo(TimeLimitTypeButton);

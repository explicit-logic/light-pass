import { memo, useCallback } from 'react';
import type { FieldError, UseFormSetValue } from 'react-hook-form';
import type { EditFormData, TimeLimitType } from '../QuizForm.types';

// Components
import TimeLimitTypeButton, { POSITIONS } from './TimeLimitTypeButton';

// Constants
import { TIME_LIMIT_TYPES } from '@/constants/configuration';

type Props = {
  error: FieldError | undefined;
  value?: TimeLimitType | null;
  onChange: (value: TimeLimitType | null) => void;
  setValue: UseFormSetValue<EditFormData>;
};

function TimeLimitTypeField(props: Props) {
  const { error, value, setValue, onChange } = props;

  const onClickOne = useCallback(() => {
    setValue('timeLimit.duration', 15);
    onChange(TIME_LIMIT_TYPES.ONE);
  }, [onChange, setValue]);

  const onClickMany = useCallback(() => {
    setValue('timeLimit.duration', 1800);
    onChange(TIME_LIMIT_TYPES.MANY);
  }, [onChange, setValue]);

  const onClickNone = useCallback(() => {
    setValue('timeLimit.duration', 0);
    onChange(null);
  }, [onChange, setValue]);

  return (
    <>
      <div className="inline-flex rounded-md shadow-sm mb-4" role="group">
        <TimeLimitTypeButton active={value === TIME_LIMIT_TYPES.ONE} caption="One" onClick={onClickOne} position={POSITIONS.left}>
          <svg
            className="w-4 h-4 me-2"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>One</title>
            <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
          </svg>
        </TimeLimitTypeButton>
        <TimeLimitTypeButton active={!value} caption="None" onClick={onClickNone} position={POSITIONS.center} />
        <TimeLimitTypeButton active={value === TIME_LIMIT_TYPES.MANY} caption="All" onClick={onClickMany} position={POSITIONS.right}>
          <svg
            className="w-4 h-4 me-2"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Many</title>
            <path d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113C-2.3 103.6-2.3 88.4 7 79s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32zM160 416c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32zM48 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
          </svg>
        </TimeLimitTypeButton>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500" role="alert">
          {error?.message}
        </p>
      )}
    </>
  );
}

export default memo(TimeLimitTypeField);

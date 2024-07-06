import { memo } from 'react';

import checkboxImage from '@/assets/builder-guide/checkbox.jpg';
import editQuestionImage from '@/assets/builder-guide/edit-question.jpg';
import questionTypesImage from '@/assets/builder-guide/question-types.jpg';
import tabsImage from '@/assets/builder-guide/tabs.jpg';

function BuilderGuide() {
  return (
    <div className="w-full h-96 p-3 rounded-t-lg font-extralight overflow-scroll text-gray-900 space-y-2 dark:text-gray-300 dark:bg-black">
      <p>
        To add questions, click on the{' '}
        <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
          Add Questions
        </kbd>{' '}
        button.
      </p>
      <p>You can place all the questions on one page or create the required number of questions on each page using the Question Builder:</p>
      <p>
        <img alt="Multi pages" src={tabsImage} />
      </p>
      <p>To add a question, select the type of question you prefer:</p>
      <p>
        <img alt="Question type" src={questionTypesImage} />
      </p>
      <p>To set the correct answer, select it by clicking on the checkbox:</p>
      <p>
        <img alt="Correct answer" src={checkboxImage} />
      </p>
      <p>To edit a question, hover over it with the cursor:</p>
      <p>
        <img alt="Edit a question" src={editQuestionImage} />
      </p>
    </div>
  );
}

export default memo(BuilderGuide);

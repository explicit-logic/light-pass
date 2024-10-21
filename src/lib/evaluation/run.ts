import type { Responder } from '@/models/Responder';

// API
import { getOne as getOneAnswer } from '@/api/answers';
import { savePoints } from '@/api/corrections';
import { autoEvaluate as autoEvaluatePageResult, saveQuestionCount } from '@/api/pageResult';
import { getPageData, getSlugs } from '@/api/pages';
import { autoEvaluate as autoEvaluateResponder, getOne as getOneResponder, resetResults } from '@/api/responders';

// Constants
import { QUESTION_TYPES } from '@/constants/block';
import { TYPES } from '@/constants/block';
import { MARKS } from '@/constants/marks';

// Helpers
import { retrieveAnswer } from '@/helpers/retrieveAnswer';

export async function run(responderId: Responder['id']) {
  const responder = await getOneResponder(responderId);
  const slugs = await getSlugs(responder.quizId, responder.language);

  await resetResults(responder.id);

  for (const slug of slugs) {
    await evaluatePage(responder, slug);
  }

  const finalMark = await autoEvaluateResponder(responder.id);

  return finalMark;
}

async function evaluatePage(responder: Responder, page: string) {
  const pageData = await getPageData(responder.quizId, responder.language, page);
  const { formData } = pageData;
  let questionCount = 0;
  for (const block of formData) {
    if (block.type in QUESTION_TYPES) {
      await processQuestion(responder, block as QuestionBlock, page);
      questionCount += 1;
    }
  }

  await autoEvaluatePageResult({
    responderId: responder.id,
    page,
    questionCount,
  });
}

async function processQuestion(responder: Responder, block: QuestionBlock, page: string) {
  const points = await evaluateQuestion(responder, block, page);
  await savePoints({
    responderId: responder.id,
    page,
    question: block.name,
    points,
    verified: false,
  });
}

async function evaluateQuestion(responder: Responder, block: QuestionBlock, page: string) {
  const pageAnswer = await getOneAnswer(responder.id, page);

  if (!pageAnswer) return MARKS.WRONG;

  const answer = retrieveAnswer(pageAnswer, block.name);

  if (block.type === TYPES.RADIO_GROUP) {
    return evaluateMultipleChoice(block, answer);
  }

  if (block.type === TYPES.CHECKBOX_GROUP) {
    return evaluateMultipleResponse(block, answer);
  }

  return MARKS.WRONG;
}

function evaluateMultipleChoice(block: Blocks.RadioGroup, answer: string[]) {
  const { values } = block;
  const [answerValue] = answer;

  for (const option of values) {
    const right = option.selected && answerValue === option.value;

    if (right) return MARKS.RIGHT;
  }

  return MARKS.WRONG;
}

function evaluateMultipleResponse(block: Blocks.CheckboxGroup, answer: string[]) {
  const { values } = block;
  let rightAnswerCount = 0;
  let wrongAnswerCount = 0;
  let rightOptionCount = 0;

  for (const option of values) {
    const right = option.selected;
    const selected = answer.includes(option.value);

    if (right) {
      rightOptionCount += 1;
      if (selected) {
        rightAnswerCount += 1;
      }
    } else if (selected) {
      wrongAnswerCount += 1;
    }
  }

  if (!rightOptionCount) return MARKS.WRONG;

  if (!wrongAnswerCount) {
    if (rightOptionCount === rightAnswerCount) return MARKS.RIGHT;

    if (rightAnswerCount) return MARKS.HALF;
  }

  return MARKS.WRONG;
}

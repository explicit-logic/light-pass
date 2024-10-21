import type { Responder } from '@/models/Responder';

import { save as saveAnswer } from '@/api/answers';
import { getPageData, getSlugs } from '@/api/pages';
// API
import { getOne as getOneResponder } from '@/api/responders';

// Constants
import { QUESTION_TYPES } from '@/constants/block';
import { TYPES } from '@/constants/block';

export async function generateMockAnswers(responderId: Responder['id']) {
  const responder = await getOneResponder(responderId);
  const slugs = await getSlugs(responder.quizId, responder.language);

  for (const slug of slugs) {
    await processPage(responder, slug);
  }
}

async function processPage(responder: Responder, page: string) {
  const pageData = await getPageData(responder.quizId, responder.language, page);
  const { formData } = pageData;

  const answerObj: Record<string, string | string[]> = {};

  for (const block of formData) {
    if (block.type in QUESTION_TYPES) {
      const answer = await generateRandomAnswer(block as QuestionBlock);
      if (typeof answer !== 'undefined') {
        answerObj[(block as QuestionBlock).name] = answer;
      }
    }
  }

  await saveAnswer({
    answer: answerObj,
    responderId: responder.id,
    page,
  });
}

async function generateRandomAnswer(block: QuestionBlock) {
  if (block.type === TYPES.RADIO_GROUP) {
    const { values } = block;
    const randomIndex = getRandomNumber(0, values.length - 1);
    const value = values[randomIndex].value;

    if (value) return value.toString();
  }

  if (block.type === TYPES.CHECKBOX_GROUP) {
    const { values } = block;
    const randomCount = getRandomNumber(1, values.length);
    const answer = new Set<string>();
    for (let i = 0; i < randomCount; i++) {
      const randomIndex = getRandomNumber(0, values.length - 1);
      const value = values[randomIndex].value;
      if (value) answer.add(values[randomIndex].value);
    }

    return [...answer];
  }
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

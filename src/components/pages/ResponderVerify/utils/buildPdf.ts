import type { Correction } from '@/models/Correction';
import type { Responder } from '@/models/Responder';
import type { Content, TDocumentDefinitions, UnorderedListElement } from 'pdfmake/interfaces';

// API
import { getOne as getOneAnswer } from '@/api/answers';
import { getManyOnPage as getManyCorrections } from '@/api/corrections';
import { getPageData, getSlugs } from '@/api/pages';
import { getOne as getOneResponder } from '@/api/responders';

// Lib
import { COLORS, getCheckbox, getHeader, getRadio } from '@/lib/pdf-make/markup';

// Constants
import { QUESTION_TYPES, TYPES } from '@/constants/block';
import { MARKS, type MARK_TYPE } from '@/constants/marks';

// Helpers
import { retrieveAnswer } from '@/helpers/retrieveAnswer';

export async function buildPdf(responderId: Responder['id']) {
  const responder = await getOneResponder(responderId);
  const slugs = await getSlugs(responder.quizId, responder.language);

  const content: Content[] = [
    '\n',
    { text: responder.name, bold: true, fontSize: 22 },
    { text: responder.email, color: COLORS.GRAY_700, fontSize: 14, marginBottom: 10 },
    {
      text: [
        { text: 'Mark: ', fontSize: 14, bold: true },
        { text: responder.finalMark, color: COLORS.BLUE_600, fontSize: 20, bold: true },
      ],
      marginBottom: 10,
    },
  ];

  for (const slug of slugs) {
    await processPage(responder, slug, content);
  }

  const documentDefinition: TDocumentDefinitions = {
    header: getHeader(),
    content,
    styles: {
      label: {
        bold: true,
        fontSize: 12,
        marginBottom: 10,
        marginTop: 10,
      },
      item: {
        marginBottom: 5,
        marginLeft: -10,
      },
    },
    defaultStyle: {
      fontSize: 12,
    },
  };

  return documentDefinition;
}

async function processPage(responder: Responder, page: string, content: Content[]) {
  const pageData = await getPageData(responder.quizId, responder.language, page);
  const answerObj = await getOneAnswer(responder.id, page);
  const corrections = await getManyCorrections(responder.id, page);
  const correctionsMap = corrections.reduce<Record<Correction['question'], Correction>>((acc, curr) => {
    acc[curr.question] = curr;
    return acc;
  }, {});
  const { formData } = pageData;
  for (const block of formData) {
    if (block.type in QUESTION_TYPES) {
      const correction = correctionsMap[(block as QuestionBlock).name];
      const answer = retrieveAnswer(answerObj, (block as QuestionBlock).name);
      await processQuestion({ answer, block: block as QuestionBlock, content, correction });
    }
  }
}

type ProcessQuestionParams = {
  answer: string[];
  block: QuestionBlock;
  content: Content[];
  correction?: Correction;
};
async function processQuestion(params: ProcessQuestionParams) {
  const { answer, block, content, correction } = params;
  const { points } = correction ?? {};
  const questionColor = getQuestionColor(points);
  if (block.type === TYPES.RADIO_GROUP) {
    const [answerValue] = answer;
    const { values } = block;
    const ul: UnorderedListElement[] = [];
    for (const option of values) {
      const checked = answerValue === option.value;
      const right = checked && option.selected;
      const labelColor = option.selected ? COLORS.CORRECT : checked ? COLORS.WRONG : COLORS.PRIMARY;
      ul.push({
        text: [getRadio(checked, right ? COLORS.CORRECT : COLORS.PRIMARY), ' ', { text: option.label, color: labelColor }],
        style: 'item',
      });
    }
    content.push(
      { text: block.label, color: questionColor, style: 'label' },
      {
        type: 'none',
        ul,
      },
    );
  }
  if (block.type === TYPES.CHECKBOX_GROUP) {
    const { values } = block;
    const ul: UnorderedListElement[] = [];
    for (const option of values) {
      const checked = answer.includes(option.value);
      const right = checked && option.selected;
      const labelColor = option.selected ? COLORS.CORRECT : checked ? COLORS.WRONG : COLORS.PRIMARY;
      ul.push({
        text: [getCheckbox(checked, right ? COLORS.CORRECT : COLORS.PRIMARY), ' ', { text: option.label, color: labelColor }],
        style: 'item',
      });
    }
    content.push(
      { text: block.label, color: questionColor, style: 'label' },
      {
        type: 'none',
        ul,
      },
    );
  }
}

function getQuestionColor(points?: MARK_TYPE) {
  if (points === MARKS.WRONG) {
    return COLORS.WRONG;
  }

  if (points === MARKS.HALF) {
    return COLORS.HALF;
  }

  if (points === MARKS.RIGHT) {
    return COLORS.CORRECT;
  }

  return COLORS.PRIMARY;
}

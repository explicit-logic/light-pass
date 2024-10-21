import type { PageResult } from '@/models/PageResult';
import { Page } from '../models/Page';

// Constants
import { MARKS, MAX_MARK } from '@/constants/marks';

// Helpers
import { getLargestRemainder } from '@/helpers/getLargestRemainder';

type Params = {
  currentSlug: string | undefined;
  finalMark: number;
  pageResultsMap: Record<PageResult['page'], PageResult>;
  slugs: string[];
};
export function generatePages(params: Params) {
  const { currentSlug, finalMark, pageResultsMap, slugs } = params;
  const pages: Page[] = [];
  const assessedMap = getAssessedMap(slugs, pageResultsMap);
  const thresholdsMap = getThresholdsMap(slugs, pageResultsMap);
  const namesMap = getNamesMap(slugs);
  const marksMap = getMarksMap(slugs, pageResultsMap, finalMark);

  for (const slug of slugs) {
    pages.push(
      new Page({
        active: currentSlug === slug,
        assessed: assessedMap[slug],
        name: namesMap[slug],
        slug,
        threshold: thresholdsMap[slug],
        mark: marksMap[slug],
        verified: pageResultsMap[slug]?.verified,
      }),
    );
  }

  return pages;
}

function getAssessedMap(slugs: string[], pageResultsMap: Record<PageResult['page'], PageResult>) {
  const assessedMap: Record<PageResult['page'], boolean> = {};
  for (const slug of slugs) {
    const pageResult = pageResultsMap[slug];
    assessedMap[slug] = checkAssessed(pageResult);
  }

  return assessedMap;
}

function getNamesMap(slugs: string[]) {
  const namesMap: Record<PageResult['page'], string> = {};
  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    namesMap[slug] = `Page ${i + 1}`;
  }

  return namesMap;
}

function getMarksMap(slugs: string[], pageResultsMap: Record<PageResult['page'], PageResult>, finalMark: number) {
  const marksMap: Record<PageResult['page'], number> = {};
  const assessedPageResults = Object.values(pageResultsMap).filter((pageResult) => checkAssessed(pageResult));
  const questionsSum = assessedPageResults.reduce<number>((acc, { questionCount }) => acc + questionCount, 0);
  const maxPoints = questionsSum * MARKS.RIGHT;

  const values = assessedPageResults.map(({ points }) => Math.floor((points / maxPoints) * MAX_MARK));
  const marks = getLargestRemainder(values, finalMark);

  let n = 0;
  for (const slug of slugs) {
    const pageResult = pageResultsMap[slug];
    const assessed = checkAssessed(pageResult);

    if (!assessed) {
      marksMap[slug] = 0;
    } else {
      marksMap[slug] = marks[n];
      n += 1;
    }
  }

  return marksMap;
}

function getThresholdsMap(slugs: string[], pageResultsMap: Record<PageResult['page'], PageResult>) {
  const thresholdsMap: Record<PageResult['page'], number> = {};
  const assessedPageResults = Object.values(pageResultsMap).filter((pageResult) => checkAssessed(pageResult));
  const questionsSum = assessedPageResults.reduce<number>((acc, { questionCount }) => acc + questionCount, 0);

  const values = assessedPageResults.map(({ questionCount }) => Math.floor((questionCount / questionsSum) * MAX_MARK));
  const thresholds = getLargestRemainder(values, MAX_MARK);

  let n = 0;
  for (const slug of slugs) {
    const pageResult = pageResultsMap[slug];
    const assessed = checkAssessed(pageResult);

    if (!assessed) {
      thresholdsMap[slug] = 0;
    } else {
      thresholdsMap[slug] = thresholds[n];
      n += 1;
    }
  }

  return thresholdsMap;
}

function checkAssessed(pageResult?: PageResult) {
  return Boolean(pageResult?.questionCount);
}

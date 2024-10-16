import { getOne as getOneAnswer } from '@/api/answers';
import { getManyOnPage as getManyCorrections } from '@/api/corrections';
import { getMany as getManyPageResults } from '@/api/pageResult';
import { getPageData, getSlugs } from '@/api/pages';
import { getOne as getOneQuiz } from '@/api/quizzes';
import { getOne as getOneResponder } from '@/api/responders';
import type { Correction } from '@/models/Correction';
import type { PageResult } from '@/models/PageResult';
import type { Quiz } from '@/models/Quiz';
import { useCallback, useEffect } from 'react';
import { type LoaderFunction, useLoaderData, useSearchParams } from 'react-router-dom';

import Header from '@/components/molecules/Header';
import ResponderVerifyDetails from '@/components/molecules/ResponderVerifyDetails';
import ResponderVerifyFooter from '@/components/molecules/ResponderVerifyFooter';
import ResponderVerifyHeader from '@/components/molecules/ResponderVerifyHeader';
import ResponderVerifyMain from '@/components/molecules/ResponderVerifyMain';
import ResponderVerifySidebar from '@/components/molecules/ResponderVerifySidebar';

export const loader: LoaderFunction = async ({ params, request }) => {
  const { responderId } = params as unknown as { responderId: string };

  const url = new URL(request.url);
  const currentSlug = url.searchParams.get('slug') ?? undefined;

  const responder = await getOneResponder(Number(responderId));
  const [answer, quiz, slugs, corrections, pageResults, pageData] = await Promise.all([
    getOneAnswer(responder.id, currentSlug),
    getOneQuiz(responder.quizId),
    getSlugs(responder.quizId, responder.language),
    getManyCorrections(responder.id, currentSlug),
    getManyPageResults(responder.id),
    getPageData(responder.quizId, responder.language, currentSlug),
  ]);

  const correctionsMap = corrections.reduce<Record<Correction['question'], Correction>>((acc, curr) => {
    acc[curr.question] = curr;
    return acc;
  }, {});

  const pageResultsMap = pageResults.reduce<Record<PageResult['page'], PageResult>>((acc, curr) => {
    acc[curr.page] = curr;
    return acc;
  }, {});

  return {
    answer,
    correctionsMap,
    pageData,
    pageResultsMap,
    quiz,
    responder,
    slugs,
  };
};

export function Component() {
  const { pageResultsMap, quiz, slugs } = useLoaderData() as {
    quiz: Quiz;
    pageResultsMap: Record<PageResult['page'], PageResult>;
    slugs: string[];
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSlug = searchParams.get('slug');
  const goToPage = useCallback((slug: string) => setSearchParams({ slug }), [setSearchParams]);
  const changePage = useCallback((slug: string) => () => goToPage(slug), [goToPage]);

  useEffect(() => {
    if (currentSlug) return;

    for (const slug of slugs) {
      if (!pageResultsMap?.[slug]?.verified) {
        return goToPage(slug);
      }
    }
    const [firstSlug] = slugs;
    if (firstSlug) {
      return goToPage(firstSlug);
    }
  }, [goToPage, currentSlug, pageResultsMap, slugs]);

  return (
    <>
      <Header title={quiz.name} />
      <div className="mx-auto pb-20">
        <ResponderVerifyHeader />
        <ResponderVerifyDetails />

        <div className="flex flex-col sm:flex-row h-screen">
          <ResponderVerifySidebar changePage={changePage} currentSlug={currentSlug} />
          <ResponderVerifyMain currentSlug={currentSlug} />
        </div>

        <ResponderVerifyFooter />
      </div>
    </>
  );
}

import { getOne as getOneAnswer } from '@/api/answers';
import { getManyOnPage as getManyCorrections } from '@/api/corrections';
import { getMany as getManyPageResults } from '@/api/pageResult';
import { getPageData, getSlugs } from '@/api/pages';
import { getOne as getOneQuiz } from '@/api/quizzes';
import { getOne as getOneResponder } from '@/api/responders';
import type { Correction } from '@/models/Correction';
import type { PageResult } from '@/models/PageResult';
import type { Quiz } from '@/models/Quiz';
import type { Responder } from '@/models/Responder';
import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type LoaderFunction, useLoaderData, useSearchParams } from 'react-router-dom';
import type { FinalMarkForm } from './types/FinalMarkForm.types';

// Components
import HeaderLocale from '@/components/atoms/HeaderLocale';
import Header from '@/components/molecules/Header';
import Details from './components/Details';
import Footer from './components/Footer';
import ResponderVerifyHeader from './components/Header';
import Main from './components/Main';
import Sidebar from './components/Sidebar';

// Utils
import { generatePages } from './utils/generatePages';

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

  const pages = generatePages({
    currentSlug,
    finalMark: responder.finalMark,
    pageResultsMap,
    slugs,
  });

  return {
    answer,
    correctionsMap,
    pageData,
    pageResultsMap,
    pages,
    quiz,
    responder,
    slugs,
  };
};

export function Component() {
  const { pageResultsMap, responder, quiz, slugs } = useLoaderData() as {
    quiz: Quiz;
    pageResultsMap: Record<PageResult['page'], PageResult>;
    responder: Responder;
    slugs: string[];
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSlug = searchParams.get('slug');
  const goToPage = useCallback((slug: string) => setSearchParams({ slug }), [setSearchParams]);
  const changePage = useCallback((slug: string) => () => goToPage(slug), [goToPage]);

  const methods = useForm<FinalMarkForm>({
    defaultValues: {
      finalMark: responder.finalMark,
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data: FinalMarkForm) => {});

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
      <Header right={<HeaderLocale>{responder.language}</HeaderLocale>} title={quiz.name} />
      <FormProvider {...methods}>
        <form className="mx-auto pb-20" onSubmit={onSubmit}>
          <ResponderVerifyHeader />
          <Details />

          <div className="flex flex-col sm:flex-row h-screen">
            <Sidebar changePage={changePage} />
            <Main currentSlug={currentSlug} />
          </div>

          <Footer />
        </form>
      </FormProvider>
    </>
  );
}

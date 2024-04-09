import Header from '@/components/molecules/Header';
import LocaleListComponent from '@/components/organisms/LocaleList';

function LocaleList() {
  return (
    <>
      <Header>Next.js Quiz</Header>
      <main className="flex flex-col items-center justify-center">
        <LocaleListComponent />
      </main>
    </>
  );
}

export default LocaleList;

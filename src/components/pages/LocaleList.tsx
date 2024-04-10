import Header from '@/components/molecules/Header';
import LocaleListComponent from '@/components/organisms/LocaleList';

function LocaleList() {
  return (
    <>
      <Header title="Next.js Quiz" />
      <main className="flex flex-col items-center justify-center">
        <LocaleListComponent />
      </main>
    </>
  );
}

export default LocaleList;

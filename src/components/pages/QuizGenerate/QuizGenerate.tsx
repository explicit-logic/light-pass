import Header from '@/components/molecules/Header';
import Server from './components/Server';

export function Component() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center">
        <Server />
      </main>
    </>
  );
}

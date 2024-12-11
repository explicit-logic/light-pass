import Header from '@/components/molecules/Header';
import Client from './components/Client';

export function Component() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center">
        <Client />
      </main>
    </>
  );
}

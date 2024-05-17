import { useParams } from 'react-router-dom';

import LocaleItem from '@/components/molecules/LocaleItem';

export function Component() {
  // const { language } = useParams();
  // const { quiz } = useLoaderData() as { quiz: Quiz };

  return (
    <>
      <LocaleItem />
    </>
  );
}

import { memo, useCallback, useState } from 'react';

import { completion } from '@/lib/llm/api';
// Lib
import { start } from '@/lib/llm/server';

function Server() {
  const [loading, setLoading] = useState(false);
  const startServer = useCallback(async () => {
    try {
      setLoading(true);
      await start();
      const result = await completion({
        prompt: 'You are an expert quiz maker. Create a quiz with 5 questions about geography',
        n_predict: 128,
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="py-2">
      <button
        type="button"
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        disabled={loading}
        onClick={startServer}
      >
        Generate
      </button>
    </div>
  );
}

export default memo(Server);

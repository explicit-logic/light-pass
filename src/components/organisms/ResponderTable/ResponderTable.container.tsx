import { useEffect } from 'react';

// Components
import ResponderTableView from './ResponderTable.view';

// Hooks
import { useResponderStore } from '@/hooks/useResponderStore';

// Models
import Responder from '@/models/Responder';

function ResponderTableContainer() {
  const responders = useResponderStore.use.responders();
  const addResponder = useResponderStore.use.addResponder();

  useEffect(() => {
    const responder = new Responder({
      id: 'ccsfdg',
      quizId: 1,
      agent: 'Agent',
      timeZone: 'UTC',
      theme: 'auto',
    });
    responder.identify({
      email: 'member@example.com',
      name: 'Bob Whistle',
      group: 'X-1CS',
    });
    addResponder({
      id: 'r1',
      quizId: 1,
      agent: 'Agent',
      identified: false,
      timeZone: 'UTC',
      theme: 'auto',
      locale: 'en',
      name: 'Responder 1',
    });
    addResponder({
      id: 'r2',
      quizId: 1,
      agent: 'Agent',
      identified: true,
      timeZone: 'UTC',
      theme: 'auto',
      locale: 'en',
      name: 'Responder 2',
    });
    addResponder({
      id: 'r3',
      quizId: 1,
      agent: 'Agent',
      identified: true,
      timeZone: 'UTC',
      theme: 'auto',
      locale: 'en',
      name: 'Responder 3',
    });
  }, [addResponder]);

  return <ResponderTableView responders={responders} />;
}

export default ResponderTableContainer;

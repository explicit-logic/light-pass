// Components
import ResponderTableView from './ResponderTable.view';

// Hooks
import { useResponderStore } from '@/hooks/useResponderStore';

function ResponderTableContainer() {
  const responders = useResponderStore.use.responders();

  return <ResponderTableView responders={responders} />;
}

export default ResponderTableContainer;

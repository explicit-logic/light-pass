import { useParams } from 'react-router-dom';

// Components
import JoinButtonView from './JoinButton.view';

// Constants
import { STATES } from '@/constants/connection';

// Hooks
import { useConnection } from '@/hooks/useConnection';

function JoinButtonContainer() {
  const connection = useConnection();
  const params = useParams();

  if (connection.state === STATES.ONLINE) {
    return <JoinButtonView language={connection.locale} online quizId={connection.quizId} />;
  }

  if (params.quizId && params.language) {
    return <JoinButtonView language={params.language} quizId={Number(params.quizId)} />;
  }
}

export default JoinButtonContainer;

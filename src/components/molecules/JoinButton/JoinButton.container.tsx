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

  if (connection.online) {
    return <JoinButtonView language={connection.language} online quizId={connection.quizId} />;
  }

  if (params.quizId && params.language) {
    return <JoinButtonView language={params.language} quizId={Number(params.quizId)} />;
  }
}

export default JoinButtonContainer;

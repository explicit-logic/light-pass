import { Link, useParams } from 'react-router-dom';

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
    return <JoinButtonView locale={connection.locale} online quizId={connection.quizId} />;
  }

  if (params.quizId && params.locale) {
    return <JoinButtonView locale={params.locale} quizId={Number(params.quizId)} />;
  }
}

export default JoinButtonContainer;

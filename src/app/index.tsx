import ReactDOM from 'react-dom/client';
import { effectorSessionModel } from '~entities/session';
import { Provider } from './providers';

effectorSessionModel.appInitialized();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider />,
);

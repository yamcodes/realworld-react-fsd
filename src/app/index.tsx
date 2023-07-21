import { Provider as ScopeProvider } from 'effector-react';
import ReactDOM from 'react-dom/client';
import { scope } from './initialization';
import { Provider } from './providers';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ScopeProvider value={scope}>
    <Provider />
  </ScopeProvider>,
);

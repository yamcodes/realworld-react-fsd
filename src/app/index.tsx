import { Provider as ScopeProvider } from 'effector-react';
import ReactDOM from 'react-dom/client';
import { FullPageWrapper } from '~shared/ui/full-page-wrapper';
import { Spinner } from '~shared/ui/spinner';
import { init } from './initialization';
import { Provider } from './providers';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <FullPageWrapper>
    <Spinner />
  </FullPageWrapper>,
);

const { scope } = await init();

root.render(
  <ScopeProvider value={scope}>
    <Provider />
  </ScopeProvider>,
);

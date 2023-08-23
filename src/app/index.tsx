import { Provider as ScopeProvider } from 'effector-react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { FullPageError } from '~shared/ui/full-page-error';
import { FullPageWrapper } from '~shared/ui/full-page-wrapper';
import { Spinner } from '~shared/ui/spinner';
import { Router } from './providers';
import { init } from './services';
import '~shared/main.css';

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
    <ErrorBoundary FallbackComponent={FullPageError}>
      <Router />
    </ErrorBoundary>
  </ScopeProvider>,
);

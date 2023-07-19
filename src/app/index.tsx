// eslint-disable-next-line import/no-extraneous-dependencies
import { attachReduxDevTools } from '@effector/redux-devtools-adapter';
import { allSettled, fork } from 'effector';
import { Provider as ScopeProvider } from 'effector-react';
import ReactDOM from 'react-dom/client';
import { initialize } from './initialization';
import { Provider } from './providers';

const scope = fork();

attachReduxDevTools({
  scope,
  name: 'Effector devtools',
});

await allSettled(initialize, { scope });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ScopeProvider value={scope}>
    <Provider />
  </ScopeProvider>,
);

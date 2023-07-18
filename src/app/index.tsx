// eslint-disable-next-line import/no-extraneous-dependencies
import { attachReduxDevTools } from '@effector/redux-devtools-adapter';
import { allSettled, fork, scopeBind } from 'effector';
import { Provider as ScopeProvider } from 'effector-react';
import ReactDOM from 'react-dom/client';
import { effectorSessionModel } from '~entities/session';
import { initialize } from './initialization';
import { Provider } from './providers';

effectorSessionModel.appInitialized();

export const scope = fork();

await allSettled(initialize, { scope });

attachReduxDevTools({
  scope,
  name: 'Effector devtools',
});

scopeBind(initialize, { scope })();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ScopeProvider value={scope}>
    <Provider />
  </ScopeProvider>,
);

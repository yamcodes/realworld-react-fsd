import { useUnit } from 'effector-react';
import { RouterProvider } from 'react-router-dom';
import { $ctx } from '~shared/ctx';
import { FullPageWrapper } from '~shared/ui/full-page-wrapper';

export function Router() {
  const ctx = useUnit($ctx);

  console.log(ctx.router);

  return (
    <RouterProvider
      router={ctx.router}
      fallbackElement={<FullPageWrapper>loading session</FullPageWrapper>}
    />
  );
}

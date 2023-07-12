import { ReactNode } from 'react';
import { useUnit } from 'effector-react';
import { Navigate } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';
import { FullPageWrapper } from '~shared/ui/full-page-wrapper';
import { $isAuthorized, $pending } from '../../model';

type GuestGuardProps = {
  children: ReactNode;
};

export function GuestGuard(props: GuestGuardProps) {
  const { children } = props;

  const [isAuthorized, pending] = useUnit([$isAuthorized, $pending]);

  if (pending) return <FullPageWrapper>local storage pending</FullPageWrapper>;

  if (isAuthorized) return <Navigate to={PATH_PAGE.root} />;

  return <> {children} </>;
}

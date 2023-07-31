import { useUnit } from 'effector-react';
import { IoRemove } from 'react-icons/io5';
import { Button } from '~shared/ui/button';
import { UnfollowProfileModel } from './model';

type UnfollowProfileProps = {
  $$model: UnfollowProfileModel;
};

export function UnfollowProfile(props: UnfollowProfileProps) {
  const { $$model } = props;

  const username = useUnit($$model.$username);
  const unfollow = useUnit($$model.unfollow);

  return (
    <Button color="secondary" className="action-btn" onClick={unfollow}>
      <IoRemove size={16} />
      &nbsp; Unfollow {username}
    </Button>
  );
}

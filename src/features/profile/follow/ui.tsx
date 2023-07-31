import { useUnit } from 'effector-react';
import { IoAdd } from 'react-icons/io5';
import { Button } from '~shared/ui/button';
import { FollowProfileModel } from './model';

type FollowProfileProps = {
  $$model: FollowProfileModel;
};

export function FollowProfile(props: FollowProfileProps) {
  const { $$model } = props;

  const username = useUnit($$model.$username);
  const follow = useUnit($$model.follow);

  return (
    <Button
      color="secondary"
      variant="outline"
      className="action-btn"
      onClick={follow}
    >
      <IoAdd size={16} />
      &nbsp; Follow {username}
    </Button>
  );
}

import { useUnit } from 'effector-react';
import { IoTrash } from 'react-icons/io5';
import { DeleteCommentModel } from './model';

type DeleteCommentProps = {
  $$model: DeleteCommentModel;
  slug: string;
  id: number;
};

export function DeleteComment(props: DeleteCommentProps) {
  const { $$model, slug, id } = props;

  const remove = useUnit($$model.remove);

  const handleClick = () => remove({ slug, id });

  return (
    <button
      style={{ border: 0, backgroundColor: 'transparent' }}
      className="mod-options"
      onClick={handleClick}
      type="button"
    >
      <span>
        <IoTrash size={14} />
      </span>
    </button>
  );
}

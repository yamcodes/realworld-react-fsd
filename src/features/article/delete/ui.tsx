import { useUnit } from 'effector-react';
import { IoTrash } from 'react-icons/io5';
import { DeleteArticleModel } from './model';

type DeleteArticleButtonProps = {
  slug: string;
  $$model: DeleteArticleModel;
};

export function DeleteArticle(props: DeleteArticleButtonProps) {
  const { slug, $$model } = props;

  const remove = useUnit($$model.remove);

  const handleClick = () => remove(slug);

  return (
    <button
      onClick={handleClick}
      className="btn btn-outline-danger btn-sm"
      type="button"
    >
      <IoTrash size={16} />
      &nbsp;Delete Article
    </button>
  );
}

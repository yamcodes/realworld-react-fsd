import { useUnit } from 'effector-react';
import { IoHeart } from 'react-icons/io5';
import { Article } from '~entities/article';
import { Button } from '~shared/ui/button';
import { FavoriteArticleModel } from './model';

type FavoriteArticleProps = {
  article: Article;
  $$model: FavoriteArticleModel;
};

export function FavoriteArticle(props: FavoriteArticleProps) {
  const { $$model, article } = props;

  const favorite = useUnit($$model.favorite);

  const handleClick = () => favorite(article);

  return (
    <Button
      color="primary"
      variant="outline"
      className="pull-xs-right"
      onClick={handleClick}
    >
      <IoHeart size={16} /> {article.favoritesCount}
    </Button>
  );
}

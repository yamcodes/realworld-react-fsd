import { useUnit } from 'effector-react';
import { IoHeart } from 'react-icons/io5';
import { Article } from '~entities/article';
import { Button } from '~shared/ui/button';
import { UnfavoriteArticleModel } from './model';

type UnfavoriteArticleProps = {
  article: Article;
  $$model: UnfavoriteArticleModel;
};

export function UnfavoriteArticle(props: UnfavoriteArticleProps) {
  const { $$model, article } = props;

  const unfavorite = useUnit($$model.unfavorite);

  const handleClick = () => unfavorite(article);

  return (
    <Button color="primary" className="pull-xs-right" onClick={handleClick}>
      <IoHeart size={16} /> {article.favoritesCount}
    </Button>
  );
}

import { Article } from '~entities/article';
import {
  FavoriteArticle,
  UnfavoriteArticle,
  favoriteModel,
  unfavoriteModel,
} from '~features/article';

type FavoriteTogglerProps = {
  article: Article;
  $$favoriteModel: favoriteModel.FavoriteArticleModel;
  $$unfavoriteModel: unfavoriteModel.UnfavoriteArticleModel;
};

export function FavoriteToggler(props: FavoriteTogglerProps) {
  const { $$favoriteModel, $$unfavoriteModel, article } = props;

  return article.favorited ? (
    <UnfavoriteArticle $$model={$$unfavoriteModel} article={article} />
  ) : (
    <FavoriteArticle $$model={$$favoriteModel} article={article} />
  );
}

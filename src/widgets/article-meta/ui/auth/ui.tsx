import { Article, ArticleMeta } from '~entities/article';
import {
  FavoriteArticle,
  UnfavoriteArticle,
  favoriteModel,
  unfavoriteModel,
} from '~features/article';
import {
  FollowProfile,
  UnfollowProfile,
  followModel,
  unfollowModel,
} from '~features/profile';

type AuthProps = {
  article: Article;
  $$followModel: followModel.FollowProfileModel;
  $$unfollowModel: unfollowModel.UnfollowProfileModel;
  $$favoriteModel: favoriteModel.FavoriteArticleModel;
  $$unfavoriteModel: unfavoriteModel.UnfavoriteArticleModel;
};

export function Auth(props: AuthProps) {
  const {
    article,
    $$followModel,
    $$unfollowModel,
    $$favoriteModel,
    $$unfavoriteModel,
  } = props;

  return (
    <ArticleMeta
      article={article}
      actionSlot={
        <>
          {article.author.following ? (
            <UnfollowProfile
              profile={article.author}
              $$model={$$unfollowModel}
            />
          ) : (
            <FollowProfile profile={article.author} $$model={$$followModel} />
          )}
          &nbsp;&nbsp;
          {article.favorited ? (
            <UnfavoriteArticle article={article} $$model={$$unfavoriteModel} />
          ) : (
            <FavoriteArticle article={article} $$model={$$favoriteModel} />
            // <UnfavoriteArticleButton article={article}>
            //   &nbsp;Unfavorite Article&nbsp;
            //   <span className="counter">({article.favoritesCount})</span>
            // </UnfavoriteArticleButton>
            // <FavoriteArticleButton article={article}>
            //   &nbsp; Favorite Article&nbsp;
            //   <span className="counter">({article.favoritesCount})</span>
            // </FavoriteArticleButton>
          )}
        </>
      }
    />
  );
}

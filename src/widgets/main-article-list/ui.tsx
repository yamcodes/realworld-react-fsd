import { ReactNode, useEffect } from 'react';
import { useList, useUnit } from 'effector-react';
import { IoHeart } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { ArticlePreview } from '~entities/article';
import { $$sessionModel } from '~entities/session';
import { UnfavoriteArticle, FavoriteArticle } from '~features/article';
import { PATH_PAGE } from '~shared/lib/router';
import { Button } from '~shared/ui/button';
import { ErrorHandler } from '~shared/ui/error-handler';
import { MainArticleListModel } from './model';

type MainArticleListProps = {
  $$model: MainArticleListModel;
};

export function MainArticleList(props: MainArticleListProps) {
  const { $$model } = props;

  const [
    articles,
    pendingInitial,
    error,
    emptyData,
    canFetchMore,
    pendingNextPage,
  ] = useUnit([
    $$model.$articles,
    $$model.$pendingInitial,
    $$model.$error,
    $$model.$emptyData,
    $$model.$canFetchMore,
    $$model.$pendingNextPage,
  ]);

  const visitor = useUnit($$sessionModel.$visitor);

  const articlesList = useList($$model.$articles, (article) => (
    <ArticlePreview
      article={article}
      actions={
        <>
          {!visitor && (
            <Link
              to={PATH_PAGE.login}
              className="btn btn-outline-primary btn-sm pull-xs-right"
            >
              <IoHeart size={16} /> {article.favoritesCount}
            </Link>
          )}
          {visitor &&
            (article.favorited ? (
              <UnfavoriteArticle
                article={article}
                $$model={$$model.$$unfavoriteArticle}
              />
            ) : (
              <FavoriteArticle
                article={article}
                $$model={$$model.$$favoriteArticle}
              />
            ))}
        </>
      }
    />
  ));

  const loadMore = useUnit($$model.$$pagination.nextPage);
  const unmounted = useUnit($$model.unmounted);

  useEffect(() => unmounted, [unmounted]);

  return (
    <>
      {pendingInitial && <ArticleWrapper>Loading articles...</ArticleWrapper>}

      {error && (
        <ArticleWrapper>
          <ErrorHandler error={error as any} />
        </ArticleWrapper>
      )}

      {emptyData && (
        <ArticleWrapper>No articles are here... yet.</ArticleWrapper>
      )}

      {articles && articlesList}

      {canFetchMore && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            color="primary"
            variant="outline"
            onClick={loadMore}
            disabled={pendingNextPage}
          >
            {pendingNextPage ? 'Loading more...' : 'Load More'}
          </Button>
        </div>
      )}
    </>
  );
}

type ArticleWrapperProps = {
  children: ReactNode;
};

function ArticleWrapper(props: ArticleWrapperProps) {
  const { children } = props;

  return <div className="article-preview">{children}</div>;
}

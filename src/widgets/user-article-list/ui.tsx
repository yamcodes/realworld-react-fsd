import { ReactNode, useEffect } from 'react';
import { useList, useUnit } from 'effector-react';
import { ArticlePreview } from '~entities/article';
import { UnfavoriteArticle, FavoriteArticle } from '~features/article';
import { Button } from '~shared/ui/button';
import { ErrorHandler } from '~shared/ui/error-handler';
import { UserArticleListModel } from './model';

type UserArticleListProps = {
  $$model: UserArticleListModel;
};

export function UserArticleList(props: UserArticleListProps) {
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

  const articlesList = useList($$model.$articles, (article) => (
    <ArticlePreview
      article={article}
      actions={
        article.favorited ? (
          <UnfavoriteArticle
            article={article}
            $$model={$$model.$$unfavoriteArticle}
          />
        ) : (
          <FavoriteArticle
            article={article}
            $$model={$$model.$$favoriteArticle}
          />
        )
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
          <ErrorHandler error={error} />
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

import { Fragment, ReactNode, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { Article } from '~entities/article';
import { Button } from '~shared/ui/button';
import { ErrorHandler } from '~shared/ui/error-handler';
import { MainArticleListModel } from './model';

type MainArticleListProps = {
  $$model: MainArticleListModel;
  renderArticle: (article: Article) => ReactNode;
};

export function MainArticleList(props: MainArticleListProps) {
  const { $$model, renderArticle } = props;

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

      {articles &&
        articles.map((article) => (
          <Fragment key={article.slug}>{renderArticle(article)}</Fragment>
        ))}

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

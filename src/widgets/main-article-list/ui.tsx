import { useUnit } from 'effector-react';
import { IoHeart } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';
import { Button } from '~shared/ui/button';
import { ErrorHandler } from '~shared/ui/error-handler';
import { MainArticleListModel } from './model';

type MainArticleListProps = {
  $$model: MainArticleListModel;
};

export function MainArticleList(props: MainArticleListProps) {
  const { $$model } = props;

  const { data: articles, pending, error } = useUnit($$model.articlesQuery);

  return (
    <>
      {pending && <div className="article-preview">Loading articles...</div>}

      {error && (
        <div className="article-preview">
          <ErrorHandler error={error as any} />
        </div>
      )}

      {articles?.length === 0 && (
        <div className="article-preview">No articles are here... yet.</div>
      )}

      {articles &&
        articles.map(
          ({
            author: { username, image },
            title,
            description,
            slug,
            createdAt,
          }) => (
            <div key={slug} className="article-preview">
              <div className="article-meta">
                <Link to={PATH_PAGE.profile.root(username)}>
                  <img src={image} alt={username} />
                </Link>
                <div className="info">
                  <Link
                    to={PATH_PAGE.profile.root(username)}
                    className="author"
                  >
                    {username}
                  </Link>
                  <span className="date">{createdAt}</span>
                </div>
                <Button
                  color="primary"
                  variant="outline"
                  className="pull-xs-right"
                  // onClick={handleFavorite}
                >
                  <IoHeart size={16} />
                </Button>
              </div>
              <Link to={PATH_PAGE.article.slug(slug)} className="preview-link">
                <h1>{title}</h1>
                <p>{description}</p>
                <span>Read more...</span>
              </Link>
            </div>
          ),
        )}
    </>
  );
}

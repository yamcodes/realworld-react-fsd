import { useUnit } from 'effector-react';
import { Link } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/router';
import { ErrorHandler } from '~shared/ui/error-handler';
import { FullPageWrapper } from '~shared/ui/full-page-wrapper';
import { Spinner } from '~shared/ui/spinner';
import { ArticleMeta } from '~widgets/article-meta';
import { CommentForm } from '~widgets/comment-form';
import { CommentsList } from '~widgets/comments-list';
import { $$articlePage } from './model';

export function ArticlePage() {
  const [article, pending, error] = useUnit([
    $$articlePage.$article,
    $$articlePage.$pending,
    $$articlePage.$error,
  ]);

  const access = useUnit($$articlePage.$access);

  if (pending)
    return (
      <FullPageWrapper>
        <Spinner />
      </FullPageWrapper>
    );

  if (error)
    return (
      <FullPageWrapper>
        <ErrorHandler error={error} />
      </FullPageWrapper>
    );

  if (!article)
    return (
      <FullPageWrapper>
        <div>no data...</div>
      </FullPageWrapper>
    );

  const { title, body, tagList } = article;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{title}</h1>

          {access === 'anon' && <ArticleMeta.Anon article={article} />}

          {access === 'auth' && (
            <ArticleMeta.Auth
              article={article}
              $$favoriteModel={$$articlePage.$$favoriteArticle}
              $$unfavoriteModel={$$articlePage.$$unfavoriteArticle}
              $$followModel={$$articlePage.$$followProfile}
              $$unfollowModel={$$articlePage.$$unfollowProfile}
            />
          )}

          {access === 'owner' && (
            <ArticleMeta.Owner
              article={article}
              $$deleteArticleModel={$$articlePage.$$deleteArticle}
            />
          )}
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div>
              <p>{body}</p>
            </div>
            <ul className="tag-list">
              {tagList.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          {access === 'anon' && <ArticleMeta.Anon article={article} />}

          {access === 'auth' && (
            <ArticleMeta.Auth
              article={article}
              $$favoriteModel={$$articlePage.$$favoriteArticle}
              $$unfavoriteModel={$$articlePage.$$unfavoriteArticle}
              $$followModel={$$articlePage.$$followProfile}
              $$unfollowModel={$$articlePage.$$unfollowProfile}
            />
          )}

          {access === 'owner' && (
            <ArticleMeta.Owner
              article={article}
              $$deleteArticleModel={$$articlePage.$$deleteArticle}
            />
          )}
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {(access === 'auth' || access === 'owner') && (
              <CommentForm $$model={$$articlePage.$$commentForm} />
            )}

            {access === 'anon' && (
              <p>
                <Link to={PATH_PAGE.login}>Sign in</Link> or{' '}
                <Link to={PATH_PAGE.register}>sign up</Link> to add comments on
                this article.
              </p>
            )}

            <CommentsList $$model={$$articlePage.$$commentsList} />
          </div>
        </div>
      </div>
    </div>
  );
}

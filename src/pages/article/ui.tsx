import { useUnit } from 'effector-react';
import { ErrorHandler } from '~shared/ui/error-handler';
import { FullPageWrapper } from '~shared/ui/full-page-wrapper';
import { ArticleMeta } from '~widgets/article-meta';
import { $$articlePage } from './model';

export function ArticlePage() {
  const { data: article, pending, error } = useUnit($$articlePage.articleQuery);
  const articleCtx = useUnit($$articlePage.$articleCtx);

  if (pending)
    return (
      <FullPageWrapper>
        <div>loading...</div>
      </FullPageWrapper>
    );

  if (error)
    return (
      <FullPageWrapper>
        <ErrorHandler error={error as any} />
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

          {articleCtx === 'anon' && <ArticleMeta.Anon article={article} />}

          {articleCtx === 'auth' && (
            <ArticleMeta.Auth
              article={article}
              $$favoriteModel={$$articlePage.$$favoriteArticle}
              $$unfavoriteModel={$$articlePage.$$unfavoriteArticle}
              $$followModel={$$articlePage.$$followProfile}
              $$unfollowModel={$$articlePage.$$unfollowProfile}
            />
          )}

          {articleCtx === 'owner' && (
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
          {articleCtx === 'anon' && <ArticleMeta.Anon article={article} />}

          {articleCtx === 'auth' && (
            <ArticleMeta.Auth
              article={article}
              $$favoriteModel={$$articlePage.$$favoriteArticle}
              $$unfavoriteModel={$$articlePage.$$unfavoriteArticle}
              $$followModel={$$articlePage.$$followProfile}
              $$unfollowModel={$$articlePage.$$unfollowProfile}
            />
          )}

          {articleCtx === 'owner' && (
            <ArticleMeta.Owner
              article={article}
              $$deleteArticleModel={$$articlePage.$$deleteArticle}
            />
          )}
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {/* <NewCommentEditor slug={slug!} /> */}
            {/* <CommentsList slug={slug!} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

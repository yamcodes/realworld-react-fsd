import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/router';
import { Article } from '../../types';

type ArticleProps = {
  article: Article;
  actions?: ReactNode;
};

export function ArticlePreview(props: ArticleProps) {
  const { article, actions } = props;

  const {
    author: { username, image },
    title,
    description,
    slug,
    createdAt,
  } = article;

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={PATH_PAGE.profile.root(username)}>
          <img src={image} alt={username} />
        </Link>
        <div className="info">
          <Link to={PATH_PAGE.profile.root(username)} className="author">
            {username}
          </Link>
          <span className="date">{createdAt}</span>
        </div>
        {actions}
      </div>
      <Link to={PATH_PAGE.article.slug(slug)} className="preview-link">
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
      </Link>
    </div>
  );
}

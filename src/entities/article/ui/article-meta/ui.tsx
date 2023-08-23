import { ReactNode } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/router';
import { Article } from '../../types';

type ArticleMetaProps = {
  article: Article;
  actions?: ReactNode;
};

export function ArticleMeta(props: ArticleMetaProps) {
  const { article, actions } = props;
  const { createdAt, author } = article;
  const { username, image } = author;

  const formatedDate = dayjs(createdAt).format('MMMM D, YYYY');

  return (
    <div className="article-meta">
      <Link to={PATH_PAGE.profile.root(username)}>
        <img src={image} alt={username} />
      </Link>
      <div className="info">
        <Link to={PATH_PAGE.profile.root(username)} className="author">
          {username}
        </Link>
        <span className="date">{formatedDate}</span>
      </div>
      {actions}
    </div>
  );
}

import { IoAdd, IoHeart } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { Article, ArticleMeta } from '~entities/article';

type AnonProps = {
  article: Article;
};

export function Anon(props: AnonProps) {
  const { article } = props;

  return (
    <ArticleMeta
      article={article}
      actionSlot={
        <>
          <Link
            to="/login"
            className="btn btn-outline-secondary btn-sm action-btn"
          >
            <IoAdd size={16} />
            &nbsp; Follow {article.author.username}
          </Link>
          &nbsp;&nbsp;
          <Link
            to="/login"
            className="btn btn-outline-primary btn-sm action-btn"
          >
            <IoHeart size={16} />
            &nbsp;Favorite Article&nbsp;
            <span className="counter">({article.favoritesCount})</span>
          </Link>
        </>
      }
    />
  );
}

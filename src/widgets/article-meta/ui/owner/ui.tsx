import { IoPencil } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { Article, ArticleMeta } from '~entities/article';
import { DeleteArticle, deleteArticleModel } from '~features/article';

type OwnerProps = {
  article: Article;
  $$deleteArticleModel: deleteArticleModel.DeleteArticleModel;
};

export function Owner(props: OwnerProps) {
  const { article, $$deleteArticleModel } = props;

  return (
    <ArticleMeta
      article={article}
      actionSlot={
        <>
          <Link
            className="btn btn-outline-secondary btn-sm"
            to={`/editor/${article.slug}`}
            state={{ article }}
          >
            <IoPencil size={16} />
            &nbsp;Edit Article
          </Link>
          &nbsp;&nbsp;
          <DeleteArticle slug={article.slug} $$model={$$deleteArticleModel} />
        </>
      }
    />
  );
}

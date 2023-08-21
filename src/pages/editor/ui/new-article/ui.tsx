import { ArticleForm } from '~widgets/article-form';
import { $$editorNewArticlePage } from '../../model/newArticlePageModel';

export function NewArticlePage() {
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ArticleForm.New
              $$model={$$editorNewArticlePage.$$newArticleForm}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { ArticleForm } from '~widgets/article-form';
import { $$editorEditArticlePage } from '../../model/editArticlePageModel';

export function EditArticlePage() {
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ArticleForm.Edit
              $$model={$$editorEditArticlePage.$$editArticleForm}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

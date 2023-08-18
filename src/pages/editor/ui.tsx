import { ChangeEvent, FormEventHandler } from 'react';
import { useUnit } from 'effector-react';
import { FormFieldModel } from '~shared/lib/form';
import { $$editorPage } from './model';

export function EditorPage() {
  const pending = useUnit($$editorPage.$pending);
  const submitted = useUnit($$editorPage.submitted);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    submitted();
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <form onSubmit={onFormSubmit}>
              <fieldset disabled={pending}>
                <TitleField $$model={$$editorPage.fields.title} />
                <DescriptionField $$model={$$editorPage.fields.description} />
                <BodyField $$model={$$editorPage.fields.body} />
                <TagField $$model={$$editorPage.fields.tagList} />
                <button
                  type="submit"
                  className="btn btn-lg btn-primary pull-xs-right"
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

type FieldType = {
  $$model: FormFieldModel<string>;
};

function TitleField(props: FieldType) {
  const { $$model } = props;
  const [value, error] = useUnit([$$model.$value, $$model.$error]);
  const [changed, touched] = useUnit([$$model.changed, $$model.touched]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    changed(e.target.value);
  return (
    <fieldset className="form-group">
      <input
        className="form-control"
        type="text"
        placeholder="Article Title"
        value={value}
        onChange={handleChange}
        onBlur={touched}
      />
      {error && <div>{error.map((e) => e)}</div>}
    </fieldset>
  );
}

function DescriptionField(props: FieldType) {
  const { $$model } = props;
  const [value, error] = useUnit([$$model.$value, $$model.$error]);
  const [changed, touched] = useUnit([$$model.changed, $$model.touched]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    changed(e.target.value);
  return (
    <fieldset className="form-group">
      <input
        className="form-control"
        type="text"
        placeholder="What's this article about?"
        value={value}
        onChange={handleChange}
        onBlur={touched}
      />
      {error && <div>{error.map((e) => e)}</div>}
    </fieldset>
  );
}

function BodyField(props: FieldType) {
  const { $$model } = props;
  const [value, error] = useUnit([$$model.$value, $$model.$error]);
  const [changed, touched] = useUnit([$$model.changed, $$model.touched]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    changed(e.target.value);
  return (
    <fieldset className="form-group">
      <textarea
        className="form-control"
        placeholder="Write your article (in markdown)"
        rows={8}
        value={value}
        onChange={handleChange}
        onBlur={touched}
      />
      {error && <div>{error.map((e) => e)}</div>}
    </fieldset>
  );
}

function TagField(props: FieldType) {
  const { $$model } = props;
  const [value, error] = useUnit([$$model.$value, $$model.$error]);
  const [changed, touched] = useUnit([$$model.changed, $$model.touched]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    changed(e.target.value);
  return (
    <fieldset className="form-group">
      <input
        className="form-control"
        type="text"
        placeholder="Enter tags"
        value={value}
        onChange={handleChange}
        onBlur={touched}
      />
      {error && <div>{error.map((e) => e)}</div>}
    </fieldset>
  );
}

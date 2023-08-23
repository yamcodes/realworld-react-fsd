import { FormEventHandler } from 'react';
import { useUnit } from 'effector-react';
import { Textarea } from '~shared/ui/textarea';
import { CommentFormModel } from './model';

type CommentFormProps = {
  $$model: CommentFormModel;
};

export function CommentForm(props: CommentFormProps) {
  const { $$model } = props;

  const pending = useUnit($$model.$pending);
  const visitor = useUnit($$model.$visitor);
  const submitted = useUnit($$model.submitted);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    submitted();
  };

  return (
    <form className="card comment-form" onSubmit={onFormSubmit}>
      <fieldset disabled={pending}>
        <div className="card-block">
          <Textarea
            className="form-control"
            placeholder="Write a comment..."
            rows={3}
            $$model={$$model.fields.body}
          />
        </div>
        <div className="card-footer">
          <img
            src={visitor!.image}
            className="comment-author-img"
            alt={visitor!.username}
          />
          <button className="btn btn-sm btn-primary" type="submit">
            Post Comment
          </button>
        </div>
      </fieldset>
    </form>
  );
}

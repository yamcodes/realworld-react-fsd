import { FormEventHandler } from 'react';
import { useUnit } from 'effector-react';
import { Input } from '~shared/ui/input';
import { Textarea } from '~shared/ui/textarea';
import { NewModel } from '../../model/newModel';

type NewProps = {
  $$model: NewModel;
};

export function New(props: NewProps) {
  const { $$model } = props;

  const pending = useUnit($$model.$pending);
  const submitted = useUnit($$model.submitted);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    submitted();
  };

  return (
    <form onSubmit={onFormSubmit}>
      <fieldset disabled={pending}>
        <Input
          $$model={$$model.fields.title}
          className="form-control"
          type="text"
          placeholder="Article Title"
        />
        <Input
          $$model={$$model.fields.description}
          className="form-control"
          type="text"
          placeholder="What's this article about?"
        />
        <Textarea
          $$model={$$model.fields.body}
          className="form-control"
          placeholder="Write your article (in markdown)"
          rows={8}
        />
        <Input
          $$model={$$model.fields.tagList}
          className="form-control"
          type="text"
          placeholder="Enter tags"
        />
        <button type="submit" className="btn btn-lg btn-primary pull-xs-right">
          Publish Article
        </button>
      </fieldset>
    </form>
  );
}

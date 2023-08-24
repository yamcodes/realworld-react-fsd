import { FormEventHandler, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { ErrorHandler } from '~shared/ui/error-handler';
import { Input } from '~shared/ui/input';
import { Textarea } from '~shared/ui/textarea';
import { UserSettingsFormModel } from './model';

type UserSettingsFormProps = {
  $$model: UserSettingsFormModel;
};

export function UserSettingsForm(props: UserSettingsFormProps) {
  const { $$model } = props;

  const error = useUnit($$model.$error);
  const pending = useUnit($$model.$$sessionUpdate.$pending);

  const [submited, unmounted] = useUnit([$$model.submitted, $$model.unmounted]);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    submited();
  };

  useEffect(() => unmounted, [unmounted]);

  return (
    <>
      {error && <ErrorHandler error={error} />}
      <form onSubmit={onFormSubmit}>
        <fieldset disabled={pending}>
          <Input
            className="form-control form-control-lg"
            type="text"
            placeholder="URL of profile picture"
            $$model={$$model.fields.image}
          />
          <Input
            className="form-control form-control-lg"
            type="text"
            placeholder="Your Name"
            $$model={$$model.fields.username}
          />
          <Textarea
            className="form-control form-control-lg"
            rows={8}
            placeholder="Short bio about you"
            $$model={$$model.fields.bio}
          />
          <Input
            className="form-control form-control-lg"
            type="text"
            placeholder="Email"
            $$model={$$model.fields.email}
          />
          <Input
            className="form-control form-control-lg"
            type="password"
            placeholder="Password"
            $$model={$$model.fields.password}
          />
          <button
            className="btn btn-lg btn-primary pull-xs-right"
            type="submit"
          >
            Update Settings
          </button>
        </fieldset>
      </form>
    </>
  );
}

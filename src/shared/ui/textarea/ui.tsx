import { ChangeEvent, TextareaHTMLAttributes, forwardRef } from 'react';
import { useUnit } from 'effector-react';
import { FormFieldModel } from '~shared/lib/form';

type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'onChange' | 'onBlur'
> & {
  $$model: FormFieldModel<any>;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (inProps, ref) => {
    const { $$model, ...other } = inProps;

    const [value, error] = useUnit([$$model.$value, $$model.$error]);
    const [changed, touched] = useUnit([$$model.changed, $$model.touched]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
      changed(e.target.value);

    return (
      <fieldset className="form-group">
        <textarea
          ref={ref}
          value={value}
          onChange={handleChange}
          onBlur={touched}
          {...other}
        />
        {error && <div>{error.map((e) => e)}</div>}
      </fieldset>
    );
  },
);

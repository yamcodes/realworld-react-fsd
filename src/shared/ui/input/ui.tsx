import { ChangeEvent, InputHTMLAttributes, forwardRef } from 'react';
import { useUnit } from 'effector-react';
import { FormFieldModel } from '~shared/lib/form';

type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'onBlur'
> & {
  $$model: FormFieldModel<any>;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (inProps, ref) => {
    const { $$model, ...other } = inProps;

    const [value, error] = useUnit([$$model.$value, $$model.$error]);
    const [changed, touched] = useUnit([$$model.changed, $$model.touched]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
      changed(e.target.value);

    return (
      <fieldset className="form-group">
        <input
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

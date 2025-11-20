import { Controller, useFormContext } from 'react-hook-form';

const InputForm = ({
  label,
  formKey,
  type,
  pattern,
  minLength,
  maxLength,
  errorMessage,
  required,
  placeholder,
}: {
  label?: string;
  formKey: string;
  type?: string;
  secureTextEntry?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  errorMessage?: string;
  required?: boolean;
  placeholder?: string;

}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <div className='flex flex-col gap-1 w-full'>
      <Controller
        control={control}
        rules={{
          required: required ? {
            value: true,
            message: errorMessage || 'El campo es requerido.',
          } : undefined,
          minLength: minLength
            ? {
              value: minLength,
              message:
                errorMessage ||
                `Se esperaba un mínimo de ${minLength} caracteres.`,
            }
            : undefined,
          maxLength: maxLength
            ? {
              value: maxLength,
              message:
                errorMessage ||
                `Se esperaba un máximo de ${maxLength} caracteres.`,
            }
            : undefined,
          pattern: pattern
            ? {
              value: pattern,
              message: errorMessage || 'El formato es incorrecto.',
            }
            : undefined,
        }}
        name={formKey}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <label className='font-bold'>
              {label} {`${!required ? '(opcional)' : ''}`}
            </label>
            <input
              name={formKey}
              type={type || 'text'}
              className='border border-gray-300 bg-background rounded-md px-4 py-2'
              placeholder={placeholder || label}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
            />
            {errors[formKey] && (
              <p className='text-red-600 font-semibold text-sm'>
                {errors[formKey]?.message as string}
              </p>
            )}
          </>
        )}
      />

    </div>
  );
};

export default InputForm;
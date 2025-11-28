import { useFormContext } from 'react-hook-form';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectFormProps {
    label: string;
    formKey: string;
    options: SelectOption[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
}

export default function SelectForm({
    label,
    formKey,
    options,
    placeholder = 'Selecciona una opción',
    required = false,
    disabled = false,
    isLoading = false,
}: SelectFormProps) {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[formKey];

    return (
        <div className="space-y-1">
            <label htmlFor={formKey} className="block font-bold text-foreground">
                {label}
                {required && <span className="text-btn-danger ml-1">*</span>}
            </label>

            <select
                id={formKey}
                {...register(formKey, {
                    required: required ? `${label} es requerido` : false,
                })}
                disabled={disabled || isLoading}
                className={`
                    border border-gray-300 bg-background rounded-md px-4 py-2 outline-0 w-full
                    ${error
                        ? 'border-btn-danger focus:border-btn-danger'
                        : 'border-foreground/20 focus:border-btn-primary hover:border-foreground/30'
                    }
                `}
            >
                <option value="">
                    {isLoading ? 'Cargando...' : placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <p className="text-btn-danger text-sm mt-1">
                    {error.message as string}
                </p>
            )}
        </div>
    );
}

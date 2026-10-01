import { SelectHTMLAttributes, forwardRef } from 'react';

interface BrutalSelectOption {
  value: string;
  label: string;
}

interface BrutalSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: BrutalSelectOption[];
  placeholder?: string;
}

const BrutalSelect = forwardRef<HTMLSelectElement, BrutalSelectProps>(
  ({ label, error, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block font-mono font-bold uppercase text-xs tracking-wider mb-2"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full bg-white border-[3px] px-4 py-3 font-mono text-base focus:outline-none focus:shadow-brutal-sm rounded-none disabled:bg-bg disabled:opacity-60 ${
            error ? 'border-danger bg-red-50' : 'border-dark'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 font-mono text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

BrutalSelect.displayName = 'BrutalSelect';

export default BrutalSelect;

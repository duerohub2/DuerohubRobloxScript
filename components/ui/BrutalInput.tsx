import { InputHTMLAttributes, forwardRef } from 'react';

interface BrutalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const BrutalInput = forwardRef<HTMLInputElement, BrutalInputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-mono font-bold uppercase text-xs tracking-wider mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full bg-white border-[3px] px-4 py-3 font-mono text-base focus:outline-none focus:shadow-brutal-sm rounded-none placeholder:text-textdim disabled:bg-bg disabled:opacity-60 ${
            error ? 'border-danger bg-red-50' : 'border-dark'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 font-mono text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

BrutalInput.displayName = 'BrutalInput';

export default BrutalInput;

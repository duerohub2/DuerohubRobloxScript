import { TextareaHTMLAttributes, forwardRef } from 'react';

interface BrutalTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const BrutalTextarea = forwardRef<HTMLTextAreaElement, BrutalTextareaProps>(
  ({ label, error, className = '', id, rows = 5, ...props }, ref) => {
    const textareaId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block font-mono font-bold uppercase text-xs tracking-wider mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`w-full bg-white border-[3px] px-4 py-3 font-mono text-base focus:outline-none focus:shadow-brutal-sm rounded-none placeholder:text-textdim disabled:bg-bg disabled:opacity-60 resize-y ${
            error ? 'border-danger bg-red-50' : 'border-dark'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 font-mono text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

BrutalTextarea.displayName = 'BrutalTextarea';

export default BrutalTextarea;

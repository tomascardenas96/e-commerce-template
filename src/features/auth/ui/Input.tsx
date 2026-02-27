import { InputHTMLAttributes, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...props }, ref) => (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        ref={ref}
        {...props}
        className={`mt-1 block w-full px-4 py-3 border rounded-xl outline-none transition-all ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  ),
);

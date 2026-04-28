import { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, ...props }: InputProps) {
  return (
    <label className="form-label w-100">
      <span className="fw-semibold">{label}</span>
      <input className="form-control mt-1" {...props} />
    </label>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { loginSchema, type LoginInput } from '@/lib/validators/auth';
import { login } from '@/actions/auth';

const inputClass =
  'w-full bg-white border-[3px] border-dark px-4 py-3 font-mono text-base focus:outline-none focus:shadow-brutal-sm placeholder:text-textdim disabled:bg-bg disabled:opacity-60';
const errorInputClass = 'border-danger bg-red-50';

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? undefined;
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setSubmitting(true);
    const result = await login(values, next);
    setSubmitting(false);
    // Only reached on failure — success redirects server-side before returning.
    if (!result.success) {
      toast.error(result.error.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md bg-white border-[3px] border-dark shadow-brutal-lg p-8"
    >
      <h1 className="text-3xl mb-6">Log in</h1>

      <label className="block mb-4">
        <span className="font-mono text-xs font-bold uppercase tracking-wide block mb-1">Email</span>
        <input
          type="email"
          autoComplete="email"
          className={`${inputClass} ${errors.email ? errorInputClass : ''}`}
          {...register('email')}
        />
        {errors.email && <p className="text-danger text-xs font-mono mt-1">{errors.email.message}</p>}
      </label>

      <label className="block mb-6">
        <span className="font-mono text-xs font-bold uppercase tracking-wide block mb-1">Password</span>
        <input
          type="password"
          autoComplete="current-password"
          className={`${inputClass} ${errors.password ? errorInputClass : ''}`}
          {...register('password')}
        />
        {errors.password && <p className="text-danger text-xs font-mono mt-1">{errors.password.message}</p>}
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white border-[3px] border-dark shadow-brutal px-6 py-3 font-mono font-bold uppercase tracking-wider text-sm hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-sm active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all duration-100 disabled:opacity-50"
      >
        {submitting ? 'Logging in...' : 'Log in'}
      </button>

      <p className="font-mono text-xs text-textdim mt-4 text-center">
        No account?{' '}
        <Link href="/register" className="underline underline-offset-2">Create one</Link>
      </p>
    </form>
  );
}

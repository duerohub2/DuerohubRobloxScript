'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { registerSchema, type RegisterInput } from '@/lib/validators/auth';
import { register as registerAction } from '@/actions/auth';

const inputClass =
  'w-full bg-white border-[3px] border-dark px-4 py-3 font-mono text-base focus:outline-none focus:shadow-brutal-sm placeholder:text-textdim disabled:bg-bg disabled:opacity-60';
const errorInputClass = 'border-danger bg-red-50';

export default function RegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setSubmitting(true);
    const result = await registerAction(values);
    setSubmitting(false);

    // Only reached on failure — success redirects server-side before returning.
    if (!result.success) {
      if (result.error.fields) {
        for (const [field, message] of Object.entries(result.error.fields)) {
          setError(field as keyof RegisterInput, { message });
        }
      }
      toast.error(result.error.message);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white border-[3px] border-dark shadow-brutal-lg p-8"
      >
        <h1 className="text-3xl mb-1">Create account</h1>
        <p className="font-mono text-xs text-textdim mb-6">No login wall on browsing — only on uploading.</p>

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

        <label className="block mb-4">
          <span className="font-mono text-xs font-bold uppercase tracking-wide block mb-1">Username</span>
          <input
            type="text"
            autoComplete="username"
            className={`${inputClass} ${errors.username ? errorInputClass : ''}`}
            {...register('username')}
          />
          {errors.username && <p className="text-danger text-xs font-mono mt-1">{errors.username.message}</p>}
        </label>

        <label className="block mb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-wide block mb-1">Password</span>
          <input
            type="password"
            autoComplete="new-password"
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
          {submitting ? 'Creating...' : 'Create account'}
        </button>

        <p className="font-mono text-xs text-textdim mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="underline underline-offset-2">Log in</Link>
        </p>
      </form>
    </main>
  );
}

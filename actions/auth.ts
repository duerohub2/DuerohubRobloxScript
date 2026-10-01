'use server';

import { redirect } from 'next/navigation';
import { ZodError } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { loginSchema, registerSchema } from '@/lib/validators/auth';

export type ActionResult =
  | { success: true }
  | { success: false; error: { code: string; message: string; fields?: Record<string, string> } };

function fieldErrors(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !(key in fields)) fields[key] = issue.message;
  }
  return fields;
}

export async function register(input: unknown): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Check the highlighted fields.', fields: fieldErrors(parsed.error) },
    };
  }

  const { email, username, password } = parsed.data;
  const supabase = await createClient();

  // Session availability right after signUp depends on the Supabase project's
  // "Confirm email" setting — with it ON there's no session yet and the
  // redirect below lands on a logged-out homepage until the email link is clicked.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) {
    // handle_new_user() rolling back the transaction on a duplicate username
    // surfaces here as a generic Postgres error, not a structured Supabase
    // auth error code — match on message text.
    if (/duplicate key|unique constraint/i.test(error.message)) {
      return {
        success: false,
        error: { code: 'CONFLICT', message: 'Username already taken.', fields: { username: 'Already taken' } },
      };
    }
    if (/already registered|already exists/i.test(error.message)) {
      return {
        success: false,
        error: { code: 'CONFLICT', message: 'Email already registered.', fields: { email: 'Already registered' } },
      };
    }
    return { success: false, error: { code: 'INTERNAL_ERROR', message: error.message } };
  }

  redirect('/');
}

export async function login(input: unknown, next?: string): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Check the highlighted fields.', fields: fieldErrors(parsed.error) },
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid email or password.' } };
  }

  const { data: profile } = await supabase
    .from('users')
    .select('is_banned, ban_reason')
    .eq('id', data.user.id)
    .single();

  if (profile?.is_banned) {
    await supabase.auth.signOut();
    return {
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: profile.ban_reason ? `Account banned: ${profile.ban_reason}` : 'Account banned.',
      },
    };
  }

  // Guard against an open redirect via a crafted `next` query value — only
  // ever follow a same-origin relative path.
  redirect(next && next.startsWith('/') ? next : '/');
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

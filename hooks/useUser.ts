'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { UserRow } from '@/types/database';

type UseUserResult = {
  user: User | null;
  profile: UserRow | null;
  loading: boolean;
};

/**
 * Client-side auth state + `public.users` profile row, synced via Supabase's
 * onAuthStateChange listener. Re-fetches the profile whenever the session's
 * user id changes — not on every silent token refresh.
 */
export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadProfile(userId: string) {
      const { data } = await supabase.from('users').select('*').eq('id', userId).single();
      if (active) setProfile(data ?? null);
    }

    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      setUser(data.user);
      if (data.user) await loadProfile(data.user.id);
      if (active) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        loadProfile(nextUser.id).finally(() => active && setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}

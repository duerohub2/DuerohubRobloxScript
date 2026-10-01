import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Service-role Supabase client. BYPASSES ROW LEVEL SECURITY — server-only,
 * never import this in a Client Component or expose SUPABASE_SERVICE_ROLE_KEY
 * to the browser bundle. Use for: avatar storage uploads, admin mutations that
 * need to act across users, and the Supabase auth user-creation trigger path.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

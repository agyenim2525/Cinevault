import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Note: process.env.SUPABASE_URL and process.env.SUPABASE_ANON_KEY are assumed
// to be set in the execution environment. Do not hardcode these values.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error("Supabase environment variables not set. App is running in mock mode.");
  
  const mockSupabaseClient = {
    from: () => ({
      select: async () => ({ data: [], error: { message: 'Supabase not configured' } }),
      insert: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      update: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      delete: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      upsert: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    }),
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
      updateUser: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
    },
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      })
    }
  };

  // Use type assertion to satisfy the SupabaseClient type
  supabase = mockSupabaseClient as any;
}

export { supabase };

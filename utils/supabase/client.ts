import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      'Supabase environment variables are missing! ' +
      'Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env or Vercel settings.'
    );
    // Return a dummy client or throw a clear error during build
    // Returning undefined would break many components, so we'll 
    // let it throw if actually called, but giving a better message.
  }

  return createBrowserClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
  )
}

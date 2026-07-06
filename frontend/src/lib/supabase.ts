import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env.local',
  )
}

// Frontend uses Supabase ONLY for authentication (sign in / session).
// All data goes through the NestJS API, never directly to Supabase.
export const supabase = createClient(supabaseUrl, supabaseKey)
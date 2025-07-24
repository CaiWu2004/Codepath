import { createClient } from "@supabase/supabase-js";

// Debug: Check if env variables are loading
console.log("Env vars:", {
  url: import.meta.env.VITE_SUPABASE_URL,
  key: import.meta.env.VITE_SUPABASE_KEY,
});

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`
    Missing Supabase configuration! Check:
    1. .env file exists in project root
    2. Variables start with VITE_
    3. Server was restarted after changes
    Current values: ${supabaseUrl}, ${supabaseKey}
  `);
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
  },
});

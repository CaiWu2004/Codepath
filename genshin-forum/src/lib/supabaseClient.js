// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Configuration validator
const validateConfig = () => {
  const errors = [];
  const env = import.meta.env;

  if (!env.VITE_SUPABASE_URL) {
    errors.push("VITE_SUPABASE_URL is required");
  } else if (!env.VITE_SUPABASE_URL.startsWith("https://")) {
    errors.push("VITE_SUPABASE_URL must start with https://");
  }

  if (!env.VITE_SUPABASE_KEY) {
    errors.push("VITE_SUPABASE_KEY is required");
  }

  if (errors.length > 0) {
    throw new Error(`Supabase configuration error:\n${errors.join("\n")}`);
  }
};

// Initialize Supabase client
const initializeSupabase = () => {
  try {
    validateConfig();

    const client = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "pkce",
          storage:
            typeof window !== "undefined" ? window.localStorage : undefined,
        },
        db: {
          schema: "public",
        },
        global: {
          headers: {
            "X-Client-Info": "genshin-forum/1.0",
          },
        },
      }
    );

    if (import.meta.env.DEV) {
      // Debugging setup
      window.supabase = client;
      client.auth.onAuthStateChange((event, session) => {
        console.log(`Auth event: ${event}`, session);
      });
    }

    return client;
  } catch (error) {
    console.error("Supabase initialization failed:", error.message);

    if (import.meta.env.DEV) {
      // Development fallback
      console.warn("Using mock Supabase client for development");
      return createMockClient();
    }

    throw error;
  }
};

// Mock client for development
const createMockClient = () => {
  const mockClient = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      signInWithPassword: async () => ({
        error: { message: "Mock client - no real authentication" },
      }),
      onAuthStateChange: () => ({ unsubscribe: () => {} }),
      user: () => null,
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () =>
        Promise.resolve({
          error: { message: "Mock client - insert disabled" },
        }),
      update: () =>
        Promise.resolve({
          error: { message: "Mock client - update disabled" },
        }),
      delete: () =>
        Promise.resolve({
          error: { message: "Mock client - delete disabled" },
        }),
    }),
    storage: {
      from: () => ({
        upload: () =>
          Promise.resolve({
            error: { message: "Mock client - upload disabled" },
          }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
    rpc: () =>
      Promise.resolve({
        data: null,
        error: { message: "Mock client - RPC disabled" },
      }),
  };

  if (import.meta.env.DEV) {
    console.log("Mock Supabase client initialized");
  }

  return mockClient;
};

const supabase = initializeSupabase();

export { supabase };

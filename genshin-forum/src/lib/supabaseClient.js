import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Debug environment variables
if (import.meta.env.DEV) {
  console.log("Supabase URL:", supabaseUrl);
  console.log("Supabase Key exists:", !!supabaseKey);
  console.log("Supabase Key length:", supabaseKey?.length);
}

// Validate environment variables
if (!supabaseUrl) {
  throw new Error("Missing VITE_SUPABASE_URL environment variable");
}

if (!supabaseKey) {
  throw new Error("Missing VITE_SUPABASE_KEY environment variable");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error("Error getting item from localStorage:", error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error("Error setting item in localStorage:", error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error("Error removing item from localStorage:", error);
        }
      },
    },
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      "X-Client-Info": "genshin-forum-app",
    },
  },
});

// Test connection and log auth state changes
if (import.meta.env.DEV) {
  // Make available in browser console for debugging
  window.supabase = supabase;

  // Test basic connection
  supabase.auth.getSession().then(({ data: { session }, error }) => {
    if (error) {
      console.error("Supabase connection error:", error);
    } else {
      console.log("Supabase connected successfully");
      console.log("Current session:", session ? "Active" : "No session");
      if (session?.user) {
        console.log("Current user ID:", session.user.id);
        console.log("Current user email:", session.user.email);
      }
    }
  });

  // Listen to auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth state changed:", event);
    if (session?.user) {
      console.log("User:", session.user.id, session.user.email);
    }
  });
}

// Helper function to check if user is authenticated
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error("Error getting current user:", error);
      return null;
    }
    return user;
  } catch (error) {
    console.error("Exception getting current user:", error);
    return null;
  }
};

// Helper function to check connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Connection test failed:", error);
      return false;
    }

    console.log("Connection test successful");
    return true;
  } catch (error) {
    console.error("Connection test exception:", error);
    return false;
  }
};

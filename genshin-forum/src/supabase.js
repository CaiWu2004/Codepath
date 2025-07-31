import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Changed to true for better OAuth handling
    storage: {
      getItem: (key) => {
        // Handle potential localStorage access errors
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error("Error accessing localStorage:", error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error("Error writing to localStorage:", error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error("Error removing from localStorage:", error);
        }
      },
    },
  },
  // Global options
  db: {
    schema: "public",
  },
});

// Enhanced debugging in development
if (import.meta.env.DEV) {
  // Log all auth events with more details
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    console.group("Supabase Auth State Change");
    console.log("Event:", event);
    console.log("Session:", session);
    console.log("User:", session?.user);
    console.log("Access token expires at:", session?.expires_at);
    console.groupEnd();

    // This helps debug the INITIAL_SESSION null issue
    if (event === "INITIAL_SESSION") {
      console.log(
        session
          ? "Initial session found"
          : "No initial session - user not logged in"
      );
    }
  });

  // Cleanup subscription when hot-reloading
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      subscription?.unsubscribe();
    });
  }

  // Expose supabase to window for debugging (dev only)
  window.supabase = supabase;
}

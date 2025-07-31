import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle profile creation/update
  const handleProfile = async (user, username) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        const { error: createError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            username:
              username ||
              user.email?.split("@")[0] ||
              "user_" + Math.random().toString(36).substring(2, 9),
          },
        ]);

        if (createError) throw createError;
      } else if (username && username !== profile.username) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ username })
          .eq("id", user.id);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error("Profile error:", error);
      throw error;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;
        if (session?.user) await handleProfile(session.user);

        setUser(session?.user ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          await handleProfile(session.user);
          if (event === "SIGNED_IN") navigate("/");
        }
        setUser(session?.user ?? null);
      } catch (err) {
        setError(err.message);
      }
    });

    return () => subscription?.unsubscribe();
  }, [navigate]);

  // Auth methods
  const signUp = async (email, password, username) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      if (error) throw error;
      if (data.user) await handleProfile(data.user, username);

      return data.user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.user) await handleProfile(data.user);

      return data.user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (username) => {
    if (!user) throw new Error("Not authenticated");
    setLoading(true);
    try {
      await handleProfile(user, username);
      const { error } = await supabase.auth.updateUser({
        data: { username },
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

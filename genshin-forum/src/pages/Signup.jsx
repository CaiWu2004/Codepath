// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    // Basic client-side validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      // Sign up with Supabase
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
            emailRedirectTo: `${window.location.origin}/welcome`,
          },
        });

      if (signUpError) throw signUpError;

      // Handle email confirmation scenario
      if (signUpData.user && signUpData.user.identities?.length === 0) {
        setShowConfirmation(true);
      } else {
        navigate("/");
      }
    } catch (err) {
      // Handle specific Supabase errors
      if (err.message.includes("User already registered")) {
        setError("This email is already registered. Please log in.");
      } else if (
        err.message.includes("Password should be at least 6 characters")
      ) {
        setError("Password must be at least 6 characters");
      } else {
        setError(err.message || "Failed to create account");
      }
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create Your Genshin Impact Account</h2>

        {showConfirmation ? (
          <div className="confirmation-message">
            <h3>Check your email!</h3>
            <p>
              We've sent a confirmation link to {email}. Please verify your
              email to complete registration.
            </p>
            <button onClick={() => navigate("/login")} className="auth-button">
              Return to Login
            </button>
          </div>
        ) : (
          <>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Choose a username"
                  minLength={3}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a password (min 6 characters)"
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="auth-button"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </button>
            </form>
            <div className="auth-footer">
              Already have an account? <Link to="/login">Log in</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

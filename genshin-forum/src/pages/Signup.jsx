import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { signUp, loading, error, resetError } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetError(); // Clear previous errors

    // Client-side validation
    if (password.length < 6) {
      return;
    }

    try {
      const { data, error: signUpError } = await signUp(
        email,
        password,
        username
      );

      if (signUpError) throw signUpError;

      // Check if email confirmation is needed
      if (data.user && data.user.identities?.length === 0) {
        setShowConfirmation(true);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create Your Genshin Impact Account</h2>
        {showConfirmation ? (
          <div className="confirmation-message">
            <h3>Email Verification Sent!</h3>
            <p>
              We've sent a confirmation link to {email}. Please check your
              inbox.
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
                  minLength={3}
                  placeholder="Choose a username"
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
                  minLength={6}
                  placeholder="Create a password (min 6 characters)"
                />
              </div>
              <button type="submit" disabled={loading} className="auth-button">
                {loading ? "Creating account..." : "Sign Up"}
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

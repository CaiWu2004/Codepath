// src/pages/Welcome.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      // Redirect to home after 3 seconds
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Welcome to Genshin Impact Forum!</h2>
        <p>Your account has been successfully verified.</p>
        <p>Redirecting you to the home page...</p>
      </div>
    </div>
  );
}

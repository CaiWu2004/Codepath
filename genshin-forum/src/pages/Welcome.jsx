import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setTimeout(() => navigate("/"), 3000); // Redirect after 3 seconds
      } else {
        navigate("/login");
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Welcome to Genshin Impact Forum!</h2>
        <p>
          Your account has been confirmed. Redirecting you to the home page...
        </p>
      </div>
    </div>
  );
}

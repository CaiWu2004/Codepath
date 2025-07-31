import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo">
          Genshin Impact Forum
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>

        {user ? (
          <>
            <Link to="/create-post" className="nav-link">
              Create Post
            </Link>
            <Link to={`/profile/${user.id}`} className="nav-link">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="nav-button"
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
            <span className="user-avatar" title={user.email}>
              {user.email?.charAt(0).toUpperCase()}
            </span>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-button">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

import { Link } from "react-router-dom";
import { FaMoon, FaSun, FaHome, FaPlus } from "react-icons/fa";

export default function Navbar({ darkMode, toggleDarkMode }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img
            src="https://genshin.honeyhunterworld.com/img/logo_200.webp"
            alt="Genshin Impact Logo"
            className="logo"
          />
          <span>Genshin Forum</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <FaHome /> Home
          </Link>
          <Link to="/create" className="nav-link">
            <FaPlus /> New Post
          </Link>
          <button onClick={toggleDarkMode} className="theme-toggle">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
}

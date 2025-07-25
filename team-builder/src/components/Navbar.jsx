import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Team Builder
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/create">Create Crewmate</Link>
      </div>
    </nav>
  );
}

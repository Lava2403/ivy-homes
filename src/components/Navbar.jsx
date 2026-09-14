import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">Ivy Homes</div>

      <div className="nav-links">
        <NavLink to="/listings">Listings</NavLink>
        <NavLink to="/rentals">Rentals</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/favourites">Saved</NavLink>
        <NavLink to="/insights">Insights</NavLink>
      </div>

      <div className="user-section">
        <span>{user?.email}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
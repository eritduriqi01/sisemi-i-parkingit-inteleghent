import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Parking<span>Inteligjent</span>
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/">Vendet</Link>
            <Link to="/rezervimet">Rezervimet e mia</Link>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            <span className="nav-user">{user.name}</span>
            <button className="btn-ghost" onClick={handleLogout}>
              Dil
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Hyr</Link>
            <Link to="/register">Regjistrohu</Link>
          </>
        )}
      </div>
    </nav>
  );
}

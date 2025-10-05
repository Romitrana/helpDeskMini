import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null; // hide navbar for unauthenticated users

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/tickets" style={{ marginRight: "1rem" }}>
        Tickets
      </Link>

      {user.role === "user" && (
        <Link to="/tickets/new" style={{ marginRight: "1rem" }}>
          New Ticket
        </Link>
      )}

      {(user.role === "agent" || user.role === "admin") && (
        <Link to="/breached" style={{ marginRight: "1rem" }}>
          Breached
        </Link>
      )}

      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

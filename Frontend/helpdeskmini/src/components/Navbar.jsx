import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import styles from "../styles/navbar.module.css";
export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null; // hide navbar for unauthenticated users

  return (
    <nav className={styles.navbar}>
      <div className={styles.userLinks}>
      <Link to="/tickets" className={styles.navLinks}>Tickets</Link>

      {user.role === "user" && <Link to="/tickets/new" className={styles.navLinks}>New Ticket</Link>}

      {(user.role === "agent" || user.role === "admin") && (
        <Link to="/breached" className={styles.navLinks}>Breached</Link>
      )}
       </div> 
      <button onClick={handleLogout} className={styles.authbtn}>
        Logout
      </button>
    </nav>
  );
}

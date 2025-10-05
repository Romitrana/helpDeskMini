// src/pages/Login.jsx
import styles from "../styles/login.module.css";
import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/tickets";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Use central API instance (automatically attaches token on subsequent requests)
      const res = await API.post("/auth/login", { email, password });

      login(res.data.user, res.data.token);

      // Redirect to the original protected page, or /tickets by default
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error?.message || "Login failed");
    }
  };

  return (
    <div className={styles.main}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label className={styles.label}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit" className={styles.logbtn}>Login</button>
      </form>
      <p>
        Don’t have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

import styles from "../styles/register.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/register", form); // backend endpoint
      navigate("/login"); // redirect to login on success
    } catch (err) {
      setError(err.response?.data?.error?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Username
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={loading} className={styles.logbtn}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p>
        Already have an account? <a href="/login">Login</a>
      </p>
      </form>
    </div>
  );
}

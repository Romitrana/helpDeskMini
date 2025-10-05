
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import styles from  "../styles/newticket.module.css"

export default function NewTicket() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Small helper to create a reasonably-unique idempotency key in the browser
  const genIdempotencyKey = () => {
    // not cryptographically strong but fine for client-side idempotency header
    return `cli-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // basic client validation
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setLoading(true);
    try {
      const idempotencyKey = genIdempotencyKey();

      const res = await API.post(
        "/tickets",
        { title: title.trim(), description: description.trim(), priority },
        {
          headers: {
            // API axios instance already attaches Authorization header via interceptor.
            "Idempotency-Key": idempotencyKey,
          },
        }
      );

      // response should include created ticket object
      const created = res.data;
      // If backend returns the ticket object directly, go to its page. If wrapped, adapt accordingly.
      const ticketId = created._id || created.id || created.ticket?._id;
      if (ticketId) {
        navigate(`/tickets/${ticketId}`);
      } else {
        // fallback to tickets list
        navigate("/tickets");
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  // Basic guard (route should handle this too)
  if (!user || user.role !== "user") {
    return (
      <div className={styles.container}>
        <p>You are not authorized to create tickets.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create New Ticket</h2>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div   className={styles.field}>
          <label>
            Title
            <br />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.input}
            />
          </label>
        </div>

        <div  className={styles.field}>
          <label>
            Description
            <br />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              className={styles.textarea}
            />
          </label>
        </div>

        <div className={styles.field}>
          <label>
            Priority
            <br />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={styles.select}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        <div>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}

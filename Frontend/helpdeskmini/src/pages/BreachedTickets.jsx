import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function BreachedTickets() {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Redirect non-agent/admin users
  useEffect(() => {
    if (user.role !== "agent" && user.role !== "admin") {
      navigate("/tickets"); // or a forbidden page
    }
  }, [user, navigate]);

  const fetchBreachedTickets = async () => {
    try {
      setLoading(true);
      const res = await API.get(
        `/tickets/breached?limit=${limit}&offset=${(page - 1) * limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTickets(res.data.tickets || []);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || "Failed to load breached tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreachedTickets();
  }, [page]);

  if (loading) return <p>Loading breached tickets...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (tickets.length === 0) return <p>No breached tickets!</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h2>Breached Tickets</h2>
      <ul>
        {tickets.map((ticket) => (
          <li
            key={ticket._id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "6px",
            }}
          >
            <h3>{ticket.title}</h3>
            <p>{ticket.description}</p>
            <p>
              Status: {ticket.status} | Priority: {ticket.priority}
            </p>
            <p>SLA Deadline: {new Date(ticket.slaDeadline).toLocaleString()}</p>
          </li>
        ))}
      </ul>

      {/* Simple pagination */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={tickets.length < limit}
        >
          Next
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/ticket.module.css";
export default function Tickets() {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 5; // tickets per page

  const fetchTickets = async (page) => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;

      const res = await API.get(`/tickets?limit=${limit}&offset=${offset}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTickets(res.data.items || res.data.tickets || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(page);
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (tickets.length === 0) return <p>No tickets found.</p>;

  return (
    <div className={styles.ticket_container}>
      <h2>Tickets</h2>

      <ul>
        {tickets.map((t) => (
          <li key={t._id}>
            <Link to={`/tickets/${t._id}`}>
              <h3>{t.title}</h3>
            </Link>
            <p>
              Status: {t.status} | Priority: {t.priority}
            </p>
            <p>SLA Deadline: {new Date(t.slaDeadline).toLocaleString()}</p>

            {/* Edit icon: only show if current user is the ticket creator */}
            {t.createdBy?._id === user?.id && (
              <span
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  cursor: "pointer",
                  fontSize: "1rem",
                  color:"#fff"
                }}
                title="Edit Ticket"
                onClick={() => navigate(`/tickets/${t._id}/edit`)}
              >
                <i class="fa fa-pencil"style={{
                  fontSize: "0.9rem",
                  marginRight:"0.2rem",
                  color:"#fff"
                }}></i>Edit
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination buttons */}
      <div
        className={styles.pagination}
      >
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

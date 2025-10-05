import styles from "../styles/details.module.css"
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState(""); // for status update
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch ticket + comments
  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTicket(res.data);
      setComments(res.data.comments || []);
      setNewStatus(res.data.status); // initialize dropdown
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await API.post(
        `/tickets/${id}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      alert(err.response?.data?.error?.message || "Failed to add comment");
    }
  };

  // Update ticket status
  const handleStatusUpdate = async () => {
    try {
      await API.patch(
        `/tickets/${id}`,
        { status: newStatus, version: ticket.version },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTicket(); // refresh ticket after update
      alert("Status updated successfully!");
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Ticket was updated by someone else. Refreshing...");
        fetchTicket();
      } else {
        alert(err.response?.data?.error?.message || "Failed to update status");
      }
    }
  };

  if (loading) return <p>Loading ticket...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!ticket) return <p>No ticket found.</p>;

  return (
    <div className={styles.details}>
      <h2>{ticket.title}</h2>
      <p>{ticket.description}</p>
      <p>
        Status: {ticket.status} | Priority: {ticket.priority}
      </p>
      <p>SLA Deadline: {new Date(ticket.slaDeadline).toLocaleString()}</p>

      {/* Status update for agent/admin */}
      {(user.role === "agent" || user.role === "admin") && (
        <div style={{ margin: "1rem 0" }}>
          <label>Status: </label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={handleStatusUpdate} style={{ marginLeft: "0.5rem" }}>
            Update Status
          </button>
        </div>
      )}

      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className={styles.comments}>
          {comments.map((c) => (
            <li key={c._id}>
              <strong>{c.userId?.username || "User"}:</strong> {c.text}
              <br />
              <small>{new Date(c.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddComment} style={{ marginTop: "1rem" }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          required
          style={{ width: "100%", height: "80px" }}
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
}

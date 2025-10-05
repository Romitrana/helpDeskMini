import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null); // store entire ticket
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await API.get(`/tickets/${id}`);
        setTicket(res.data); // save full ticket
        setTitle(res.data.title);
        setDescription(res.data.description);
      } catch (err) {
        setError(err.response?.data?.error?.message || "Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.patch(`/tickets/${id}`, {
        title,
        description,
        version: ticket.version, // now this exists
      });
      navigate(`/tickets/${id}`);
    } catch (err) {
      alert(err.response?.data?.error?.message || "Failed to update ticket");
    }
  };

  if (loading) return <p>Loading ticket...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!ticket) return <p>Ticket not found.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Edit Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Ticket</button>
      </form>
    </div>
  );
}

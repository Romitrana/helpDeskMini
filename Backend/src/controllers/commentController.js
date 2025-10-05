const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: ticketId } = req.params;

    if (!text) {
      return res.status(400).json({
        error: { code: "FIELD_REQUIRED", field: "text", message: "Comment text is required" }
      });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Ticket not found" } });

    // Role-based check
    if (req.user.role === "user" && ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "You cannot comment on this ticket" } });
    }

    if (req.user.role === "agent" && ticket.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "You cannot comment on this ticket" } });
    }

    // Create comment
    const comment = await Comment.create({
      ticketId,
      userId: req.user.id, // matches your model
      text
    });

    await comment.populate("userId", "username");

    // Push comment ID into ticket
    ticket.comments = ticket.comments ?? [];
    ticket.comments.push(comment._id);
    await ticket.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};

module.exports = { addComment };

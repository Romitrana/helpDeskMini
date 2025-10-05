const Ticket = require("../models/Ticket");

// Create a new ticket (only logged-in users)
const createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        error: {
          code: "FIELD_REQUIRED",
          message: "Title and description are required",
        },
      });
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || "low",
      createdBy: req.user.id, // from auth middleware
    });

    res.status(201).json(ticket);
  } catch (err) {
    res
      .status(500)
      .json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};

// Get all tickets (paginated, any logged-in user)
// Get all tickets (paginated + role-based filtering)
const getTickets = async (req, res) => {
  try {
    const { limit = 5, offset = 0 } = req.query;
    const numericLimit = parseInt(limit);
    const numericOffset = parseInt(offset);

    // Role-based filtering
    let filter = {};
    if (req.user.role === "user") {
      filter.createdBy = req.user.id;
    } else if (req.user.role === "agent") {
      filter.assignedTo = req.user.id;
    }

    // total tickets matching the filter
    const total = await Ticket.countDocuments(filter);

    // fetch tickets with pagination
    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 })
      .skip(numericOffset)
      .limit(numericLimit)
      .populate("createdBy", "username") // show username instead of email
      .populate("assignedTo", "username");

    res.json({
      total,
      limit: numericLimit,
      offset: numericOffset,
      items: tickets,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};
// Get single ticket by ID
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate({
        path: "comments",
        populate: { path: "userId", select: "username" }, // ensure username
      })
      .populate("createdBy", "username")
      .populate("assignedTo", "username");

    if (!ticket) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Ticket not found" },
      });
    }

    res.json(ticket);
  } catch (err) {
    res
      .status(500)
      .json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};

// Update ticket with optimistic locking
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, assignedTo, version } =
      req.body;

    if (version === undefined) {
      return res.status(400).json({
        error: {
          code: "FIELD_REQUIRED",
          field: "version",
          message: "Version is required for update",
        },
      });
    }

    // Find ticket
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Ticket not found" },
      });
    }

    // Check version match
    if (ticket.version !== version) {
      return res.status(409).json({
        error: {
          code: "VERSION_CONFLICT",
          message: "Ticket has been updated by someone else. Please refresh.",
        },
      });
    }

    // Role-based update rules
    if (req.user.role === "user") {
      // User can only update title/description of their own tickets (not status/assignment)
      if (ticket.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
          error: {
            code: "FORBIDDEN",
            message: "You cannot update this ticket",
          },
        });
      }
      if (title) ticket.title = title;
      if (description) ticket.description = description;
    }

    if (req.user.role === "agent" || req.user.role === "admin") {
      // Agents/Admins can update status, priority, assignment
      if (title) ticket.title = title;
      if (description) ticket.description = description;
      if (priority) ticket.priority = priority;
      if (status) ticket.status = status;
      if (assignedTo) ticket.assignedTo = assignedTo;
    }

    // Increment version
    ticket.version += 1;
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    res
      .status(500)
      .json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};

const getBreachedTickets = async (req, res) => {
  try {
    // Only agents and admins can access
    if (!["agent", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You cannot access breached tickets",
        },
      });
    }

    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const now = new Date();

    // Fetch tickets past SLA deadline
    const query = { slaDeadline: { $lt: now }, status: { $ne: "resolved" } }; // not yet resolved
    if (req.user.role === "agent") {
      query.assignedTo = req.user.id; // agent sees only assigned tickets
    }

    const tickets = await Ticket.find(query)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ slaDeadline: 1 }); // oldest breached first

    const total = await Ticket.countDocuments(query);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      tickets,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  getBreachedTickets,
};

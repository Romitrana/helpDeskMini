const express = require("express");
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket, 
  getBreachedTickets
} = require("../controllers/ticketController");
const auth = require("../middlewares/authMiddleware");
const commentRoutes = require("./commentRoutes");

const router = express.Router();

router.post("/", auth(["user"]), createTicket);
router.get("/", auth(["user", "agent", "admin"]), getTickets);
router.get("/breached", auth(["agent", "admin"]), getBreachedTickets);
router.get("/:id", auth(["user", "agent", "admin"]), getTicketById);
router.patch("/:id", auth(["user", "agent", "admin"]), updateTicket);
router.use("/:id/comments", commentRoutes);
module.exports = router;



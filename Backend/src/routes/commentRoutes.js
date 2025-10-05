const express = require("express");
const { addComment } = require("../controllers/commentController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true }); // merge ticketId param

router.post("/", auth(["user", "agent", "admin"]), addComment);

module.exports = router;

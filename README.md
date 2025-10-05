============= ABOUT PROJECT ============
Helpdesk - It’s a simplified ticket management system — think of it as a mini version of Zendesk, Freshdesk, or Jira Service Desk.

1. A user (customer) can raise a ticket for an issue.
2. An agent (support person) can respond, update status, and resolve it.
3. An admin can oversee everything.
4. It has comments like a discussion thread under each ticket.
5. It tracks SLAs (Service Level Agreements) → e.g., ticket must be resolved in X minutes, else it’s “breached.”

============= Project Implementation ===============
API Design for HelpDesk Mini

# 1 Auth

POST /api/auth/register → create user
POST /api/auth/login → login user, return JWT

# 2 Tickets

POST /api/tickets → create ticket (role: user)
GET /api/tickets?limit=&offset=&status=&search= → list tickets (pagination + search)

# As User

GET /api/tickets → returns only tickets I created.

# As Agent

GET /api/tickets → returns only tickets assigned to me.

# As Admin

GET /api/tickets → returns all tickets in the system.

GET /api/tickets/:id → fetch ticket details with comments + SLA info
PATCH /api/tickets/:id → update ticket (role: agent/admin)

# 3 Comments

POST /api/tickets/:id/comments → add comment to a ticket
(will show threaded timeline under each ticket)

# 4 Extras (for judges)

GET /api/health → returns {status: "ok"}
GET /api/\_meta → version, author, etc.

# 5 Models (MongoDB Schema Draft)

User: {name, email, password, role}
Ticket: {title, description, status, priority, createdBy, assignedTo, slaDeadline, version}
Comment: {ticketId, userId, text}

============== Models Metadata ==================
Q. Why version in Ticket Model?
This is for optimistic locking.
The hackathon brief requires:

“optimistic locking for PATCH; stale PATCH → 409 Conflict”

Q. What is Optimistic Locking?
It’s a technique to prevent data overwrites when multiple users try to update the same record at the same time.
Instead of using database-level locks (which can slow things down), we use a version number.

> Example:

Suppose Ticket #123 is currently:

<!-- {
  "title": "Login Issue",
  "status": "open",
  "version": 1
} -->

Agent A fetches the ticket (sees version 1).
Agent B also fetches the ticket (also sees version 1).
Agent A updates the ticket → PATCH request sends:

<!-- {
  "status": "in_progress",
  "version": 1
} -->

Backend sees version matches (1 == 1).
Update succeeds, and backend increments version → now ticket is version 2.
Agent B tries to update → PATCH request sends:

<!-- {
  "status": "resolved",
  "version": 1
} -->

Backend compares: request version (1) vs DB version (2).
They don’t match → update is rejected with 409 Conflict.

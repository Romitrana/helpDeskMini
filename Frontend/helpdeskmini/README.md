# frontend

1️⃣ Pages Overview

Your HelpDesk Mini app needs these pages according to backend APIs:

Page Route Purpose Role Access
Login /login User login All (unauthenticated users)
Register /register New user signup All
Tickets List /tickets Show list of tickets (own tickets for users, assigned for agents, all for admins) All
Ticket Detail /tickets/:id Show ticket info + comments All (role-based visibility)
New Ticket /tickets/new Create a new ticket user only
Breached Tickets /breached Show tickets past SLA agent/admin only
2️⃣ Components Needed

These will help keep your pages modular:

Component Purpose
Navbar Navigation links (Tickets, New Ticket, Breached, Logout)
TicketCard Display ticket summary in list (title, status, priority, deadline)
CommentCard Display a single comment (author, text, createdAt)
TicketForm Form to create or update a ticket
CommentForm Form to add comment to a ticket
3️⃣ Layout / UI Flow
Navbar

Shown on all pages except Login/Register

Links displayed based on user role:

user: Tickets, New Ticket, Logout

agent/admin: Tickets, Breached, Logout

Login / Register

Simple form: email + password

On success → redirect to /tickets

Tickets List

Fetch /tickets → show list using TicketCard

Click on a ticket → go to /tickets/:id

Pagination controls (optional for now)

Ticket Detail

Show ticket info (title, description, status, priority, SLA deadline)

List comments under the ticket (CommentCard)

CommentForm to add new comment

New Ticket

TicketForm to create new ticket (title, description, priority)

On success → redirect to /tickets

Breached Tickets

Fetch /tickets/breached

Show using TicketCard

Only visible to agent/admin

4️⃣ State Management

AuthContext → user & JWT (global)

Tickets → local state in Tickets/TicketDetail pages for now

Comments → local state in TicketDetail page

Later, you could create TicketsContext or CommentsContext if needed, but for now local state is enough for a working UI.

✅ Next Step

Implement Navbar to show links based on user role

Implement Login page (we already have a plan for it)

Implement Tickets List page next

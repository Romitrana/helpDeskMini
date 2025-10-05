// src/App.jsx
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Tickets from "./pages/Tickets.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";
import NewTicket from "./pages/NewTicket.jsx";
import EditTicket from "./pages/EditTicket.jsx"; // <-- import EditTicket
import Breached from "./pages/BreachedTickets.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import RequireRole from "./components/RequireRole.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <RootLayout />, // RootLayout has Navbar + Outlet
    errorElement: <ErrorPage />,
    children: [
      {
        path: "tickets",
        element: (
          <RequireAuth>
            <Tickets />
          </RequireAuth>
        ),
      },
      {
        path: "tickets/new",
        element: (
          <RequireAuth>
            <RequireRole roles={["user"]}>
              <NewTicket />
            </RequireRole>
          </RequireAuth>
        ),
      },
      {
        path: "tickets/:id",
        element: (
          <RequireAuth>
            <TicketDetail />
          </RequireAuth>
        ),
      },
      {
        path: "tickets/:id/edit", // <-- Edit ticket route
        element: (
          <RequireAuth>
            <RequireRole roles={["user"]}>
              <EditTicket />
            </RequireRole>
          </RequireAuth>
        ),
      },
      {
        path: "breached",
        element: (
          <RequireAuth>
            <RequireRole roles={["agent", "admin"]}>
              <Breached />
            </RequireRole>
          </RequireAuth>
        ),
      },
      {
        path: "",
        element: <Navigate to="tickets" />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

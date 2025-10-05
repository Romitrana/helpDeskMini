import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

/**
 * Use <RequireRole roles={['agent','admin']}>...children...</RequireRole>
 * If user not in allowed roles, redirect (here to /tickets)
 */
export default function RequireRole({ roles = [], children }) {
  const { user } = useContext(AuthContext);

  // If not logged in OR role not allowed, redirect to tickets (or choose another page)
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/tickets" replace />;
  }
  return children;
}

import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

/**
 * Wrap protected pages with <RequireAuth>...children...</RequireAuth>
 * If not logged in, redirect to /login and include the original location in state
 */
export default function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
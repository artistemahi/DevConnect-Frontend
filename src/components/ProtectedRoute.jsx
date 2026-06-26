import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

/**
 * Wraps routes that require authentication.
 *
 * The `initialising` prop (optional) lets Body.jsx signal that it's currently
 * fetching the session, so we show a loader instead of immediately redirecting.
 * This prevents the flash-to-login on hard refresh.
 */
const ProtectedRoute = ({ children, initialising = false }) => {
  const user = useSelector((store) => store.user);

  // Still checking auth — don't redirect yet
  if (initialising) return <Loader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
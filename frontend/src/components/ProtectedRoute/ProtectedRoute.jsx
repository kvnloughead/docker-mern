import { Navigate } from "react-router-dom";

// isLoggedInLoading is currently optional, but maybe become required in the
// future. It is used to ensure that, on initial page load, if a user is
// already logged in they are directed to the correct URL.
function ProtectedRoute({ children, loggedIn, isLoggedInLoading }) {
  if (isLoggedInLoading) return null;
  return loggedIn ? children : <Navigate to="/" />;
}

export default ProtectedRoute;

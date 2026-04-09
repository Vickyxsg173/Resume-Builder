import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthGate from "./AuthGate";

/**
 * ProtectedRoute – shows the AuthGate overlay if the user is not authenticated.
 * While auth state is loading, renders a spinner.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Wait until the auth check (GET /auth/user) resolves
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Show the login gate directly. If dismissed, go back home.
    return <AuthGate onClose={() => navigate("/")} />;
  }

  return children;
};

export default ProtectedRoute;

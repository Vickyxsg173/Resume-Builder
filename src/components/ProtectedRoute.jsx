import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthGate from "./AuthGate";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthGate onClose={() => navigate("/")} />;
  }

  return children;
};

export default ProtectedRoute;

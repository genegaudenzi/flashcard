import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Custom hook to get auth state

const ProtectedRoute = ({ children }) => {
  const user = useAuth(); // Get the logged-in user

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

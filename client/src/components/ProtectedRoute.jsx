import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth(); // 👈 Add loading

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role === "manager"){
    return children;
  }

  if (role && user.role !== role) {
    return <Navigate to="/not-verified" replace />;
  }


  if (!user.isVerified && role) {
    return <Navigate to="/not-verified" replace />;
  }

  return children;
};

export default ProtectedRoute;

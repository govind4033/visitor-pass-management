import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {

  const { user, loading } = useAuth();

  // wait for auth restore
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // role protection
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
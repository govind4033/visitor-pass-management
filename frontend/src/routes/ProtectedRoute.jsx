import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {

    const { user } = useAuth();

    // not logged in
    if (!user) {
        return <Navigate to="/login" />;
    }

    // role check
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" />;
    }
    
    return children;
};

export default ProtectedRoute;
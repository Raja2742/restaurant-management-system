// import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";


const ProtectedRoute = ({
    children,
    allowedRoles
}) => {
const location = useLocation();
    const {
        user,
        loading
    } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
                <Navigate
                    to="/login"
                    state={{ from: location.pathname }}
                    replace
                />
            );
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
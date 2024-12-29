import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    
    // Special case for the verify route
    if (location.pathname === '/verify') {
        try {
            const registrationData = localStorage.getItem('registrationEmail');
            if (registrationData) {
                const parsedData = JSON.parse(registrationData);
                if (parsedData.isRegistered) {
                    return children;
                }
            }
        } catch (error) {
            console.error('Error parsing registration data:', error);
        }
    }
    
    // Check for logged in user
    try {
        const userData = localStorage.getItem('registrationEmail');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.isRegistered) {
                return children;
            }
        }
    } catch (error) {
        console.error('Error parsing user data:', error);
    }
    
    // If neither condition is met, redirect to login
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
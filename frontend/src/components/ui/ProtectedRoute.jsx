import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Waits for the session restore to finish before deciding, otherwise a
// signed-in user gets bounced to /login on every hard refresh.
const ProtectedRoute = ({ children }) => {
  const { isAuthed, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="w-10 h-10 rounded-full border-2 border-blush-200 border-t-blush-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;

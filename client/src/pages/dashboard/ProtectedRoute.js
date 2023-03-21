import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/appContext';
import Loading from '../../components/Loading';

const ProtectedRoute = ({ children }) => {
  const { user, isUserLoading } = useAppContext();

  if (isUserLoading) return <Loading center />;

  if (!user) {
    return <Navigate to="/landing" />;
  }
  return children;
};
export default ProtectedRoute;

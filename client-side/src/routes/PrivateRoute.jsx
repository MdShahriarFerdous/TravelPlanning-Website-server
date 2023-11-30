import {Navigate, Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';

const PrivateRoute = () => {
  const user = useSelector((state) => state.auth.userInfo);
  return user?.isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

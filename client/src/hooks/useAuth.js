import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const signOut = () => dispatch(logout());
  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';
  const isDealer = user?.role === 'dealer';
  const isCustomer = user?.role === 'customer';

  return { user, token, loading, error, isAuthenticated, isAdmin, isDealer, isCustomer, signOut };
};

export default useAuth;

import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DealerLayout from '../layouts/DealerLayout';
import AdminLayout from '../layouts/AdminLayout';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Customer Pages
import Home from '../pages/customer/Home';
import PumpList from '../pages/customer/PumpList';
import PumpDetails from '../pages/customer/PumpDetails';
import MyOrders from '../pages/customer/MyOrders';
import Profile from '../pages/customer/Profile';
import Reviews from '../pages/customer/Reviews';

// Dealer Pages
import DealerDashboard from '../pages/dealer/Dashboard';
import DealerOrders from '../pages/dealer/Orders';
import DealerPumps from '../pages/dealer/Pumps';
import DealerStaff from '../pages/dealer/Staff';
import DealerAnalytics from '../pages/dealer/Analytics';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminDealers from '../pages/admin/Dealers';
import AdminOrders from '../pages/admin/Orders';
import AdminReports from '../pages/admin/Reports';

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/pumps" element={<PumpList />} />
      <Route path="/pumps/:id" element={<PumpDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Customer Protected */}
      <Route element={<PrivateRoute />}>
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reviews" element={<Reviews />} />
      </Route>
    </Route>

    {/* Dealer Routes */}
    <Route element={<RoleRoute role="dealer" />}>
      <Route element={<DealerLayout />}>
        <Route path="/dealer" element={<DealerDashboard />} />
        <Route path="/dealer/orders" element={<DealerOrders />} />
        <Route path="/dealer/pumps" element={<DealerPumps />} />
        <Route path="/dealer/staff" element={<DealerStaff />} />
        <Route path="/dealer/analytics" element={<DealerAnalytics />} />
      </Route>
    </Route>

    {/* Admin Routes */}
    <Route element={<RoleRoute role="admin" />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/dealers" element={<AdminDealers />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/reports" element={<AdminReports />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
